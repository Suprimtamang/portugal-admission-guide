<?php

namespace App\Services;

use App\Models\KnowledgeChunk;
use App\Models\RoadmapStep;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

class AdmissionAgentService
{
    public function chat(User $user, string $message, string $language = 'auto'): array
    {
        $key = 'chat:'.$user->id;

        if (RateLimiter::tooManyAttempts($key, 30)) {
            return [
                'reply' => 'You have reached the free assistant limit for now. Please try again in a few minutes.',
                'citations' => [],
            ];
        }

        RateLimiter::hit($key, 3600);

        if (! config('services.groq.key')) {
            return [
                'reply' => 'GROQ_API_KEY is not configured. Add it to your .env file and retry.',
                'citations' => [],
            ];
        }

        try {
            $chunks = KnowledgeChunk::search($message, 5);
            $roadmapHint = $this->roadmapHint($message);
            $officialLinks = $this->officialLinksFor($message);

            if ($chunks->isEmpty() && $roadmapHint === null && $officialLinks === []) {
                return [
                    'reply' => $this->refuseMessage($language),
                    'citations' => [
                        ['title' => 'DGES', 'url' => 'https://www.dges.gov.pt'],
                        ['title' => 'AIMA Studying', 'url' => 'https://aima.gov.pt/pt/estudar'],
                    ],
                ];
            }

            $context = $chunks->map(function (KnowledgeChunk $chunk, int $i) {
                return '['.($i + 1).'] '.$chunk->source?->title."\nURL: ".$chunk->source?->url."\n".$chunk->content;
            })->implode("\n\n");

            if ($roadmapHint) {
                $context .= "\n\n[Roadmap step]\n".$roadmapHint;
            }

            if ($officialLinks !== []) {
                $context .= "\n\n[Official links]\n".collect($officialLinks)
                    ->map(fn (array $link) => '- '.$link['title'].': '.$link['url'])
                    ->implode("\n");
            }

            $reply = $this->askGroq($message, $context, $language);

            $citations = collect($chunks
                ->map(fn (KnowledgeChunk $chunk) => [
                    'title' => $chunk->source?->title ?: 'Source',
                    'url' => $chunk->source?->url,
                ])
                ->filter(fn (array $c) => filled($c['url']))
                ->all())
                ->merge($officialLinks)
                ->unique(fn (array $c) => $c['url'])
                ->values()
                ->take(8)
                ->all();

            Cache::put('chat:last:'.$user->id, [
                'message' => $message,
                'reply' => $reply,
            ], now()->addDay());

            return [
                'reply' => $reply,
                'citations' => $citations,
            ];
        } catch (\Throwable $e) {
            Log::error('Admission agent failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'reply' => 'I could not complete that request right now. Please try again shortly. Official starting points: https://www.dges.gov.pt and https://aima.gov.pt/pt/estudar',
                'citations' => [
                    ['title' => 'DGES', 'url' => 'https://www.dges.gov.pt'],
                    ['title' => 'AIMA Studying', 'url' => 'https://aima.gov.pt/pt/estudar'],
                ],
            ];
        }
    }

    protected function askGroq(string $message, string $context, string $language): string
    {
        $languageRule = $language === 'auto'
            ? 'Detect the user language and reply in that language.'
            : 'Reply in language code: '.$language.'.';

        $system = <<<PROMPT
You are the Portugal Admission Guide assistant for immigrants and foreign-secondary applicants.
You are NOT a lawyer and NOT an official government service.
Use ONLY the provided CONTEXT. If context is insufficient, say you cannot confirm and point to DGES/AIMA.
Keep Portuguese legal terms with a short gloss.
{$languageRule}
End with a short "Sources:" list of the URLs you used from context.
Never invent deadlines, fees, or approval outcomes.
PROMPT;

        $userPrompt = "CONTEXT:\n{$context}\n\nUSER QUESTION:\n{$message}";

        $response = Http::withToken((string) config('services.groq.key'))
            ->timeout(45)
            ->acceptJson()
            ->post(rtrim((string) config('services.groq.base_uri'), '/').'/chat/completions', [
                'model' => config('services.groq.model'),
                'temperature' => 0.2,
                'messages' => [
                    ['role' => 'system', 'content' => $system],
                    ['role' => 'user', 'content' => $userPrompt],
                ],
            ]);

        if (! $response->successful()) {
            throw new \RuntimeException('Groq HTTP '.$response->status().': '.$response->body());
        }

        $content = data_get($response->json(), 'choices.0.message.content');

        if (! is_string($content) || trim($content) === '') {
            throw new \RuntimeException('Empty Groq response');
        }

        return trim($content);
    }

    protected function roadmapHint(string $message): ?string
    {
        $map = [
            'eligibility' => ['eligib', 'national student', '2 year', 'residence', 'international student'],
            'attestation' => ['attest', 'apostille', 'legaliz', 'translation', 'certificate'],
            'equivalency' => ['equival', 'gpa', 'escola secund'],
            'substitution' => ['exam', 'artigo 20', 'cnaes', 'provas'],
            'gaes' => ['gaes', 'senha', 'password'],
            'finish' => ['application', 'candidatura', 'choices', 'phase'],
        ];

        $hay = strtolower($message);
        foreach ($map as $slug => $needles) {
            foreach ($needles as $needle) {
                if (str_contains($hay, $needle)) {
                    $step = RoadmapStep::query()->where('slug', $slug)->first();
                    if ($step) {
                        return $step->title."\n".$step->intro;
                    }
                }
            }
        }

        return null;
    }

    /**
     * @return array<int, array{title: string, url: string}>
     */
    protected function officialLinksFor(string $message): array
    {
        $hay = strtolower($message);

        if (str_contains($hay, 'aima') || str_contains($hay, 'visa') || str_contains($hay, 'residence permit')) {
            return [
                ['title' => 'AIMA Studying', 'url' => 'https://aima.gov.pt/pt/estudar'],
                ['title' => 'AIMA Art. 91', 'url' => 'https://aima.gov.pt/pt/estudar/autorizacao-de-residencia-emitida-a-estudantes-do-ensino-superior-art-91-o'],
            ];
        }

        if (str_contains($hay, 'equival')) {
            return [
                ['title' => 'DGE Equivalence FAQ', 'url' => 'https://www.dge.mec.pt/faq-equivalence-foreign-qualifications'],
            ];
        }

        return [];
    }

    protected function refuseMessage(string $language): string
    {
        return match ($language) {
            'pt' => 'Não encontrei informação certificada suficiente na base de conhecimento. Confirme em DGES ou AIMA.',
            'hi' => 'प्रमाणित जानकारी पर्याप्त नहीं मिली। कृपया DGES या AIMA पर जाँच करें।',
            'ne' => 'प्रमाणित जानकारी पर्याप्त भेटिएन। कृपया DGES वा AIMA मा जाँच गर्नुहोस्।',
            default => 'I could not find enough certified information in the knowledge base for that question. Please check DGES or AIMA directly.',
        };
    }
}
