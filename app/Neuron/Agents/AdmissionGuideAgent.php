<?php

namespace App\Neuron\Agents;

use App\Models\KnowledgeChunk;
use App\Models\RoadmapStep;
use NeuronAI\Agent\Agent;
use NeuronAI\Agent\SystemPrompt;
use NeuronAI\Providers\AIProviderInterface;
use NeuronAI\Providers\OpenAILike;
use NeuronAI\Tools\PropertyType;
use NeuronAI\Tools\Tool;
use NeuronAI\Tools\ToolProperty;

class AdmissionGuideAgent extends Agent
{
    public function __construct(
        protected string $replyLanguage = 'auto',
    ) {
        parent::__construct();
    }

    protected function provider(): AIProviderInterface
    {
        return new OpenAILike(
            baseUri: rtrim((string) config('services.groq.base_uri'), '/'),
            key: (string) config('services.groq.key'),
            model: (string) config('services.groq.model'),
            parameters: [
                'temperature' => 0.2,
            ],
        );
    }

    public function instructions(): string
    {
        $language = $this->replyLanguage === 'auto'
            ? 'Detect the user language and reply in that language.'
            : 'Reply in language code: '.$this->replyLanguage.'.';

        return (string) new SystemPrompt(
            background: [
                'You are the Portugal Admission Guide agent for immigrants and foreign-secondary applicants.',
                'You help with National Student pathway, equivalency, exam substitution, AIMA study residence, and university contests.',
                'You are NOT a lawyer and NOT an official government service.',
            ],
            steps: [
                'Always call search_knowledge before answering factual questions.',
                'You may call get_roadmap_step or list_official_links when helpful.',
                'If tools return no useful evidence, refuse clearly and suggest DGES e-balcão or AIMA.',
                'Keep Portuguese legal terms (e.g. equivalência, provas de ingresso, autorização de residência) with a short gloss.',
                $language,
            ],
            output: [
                'Answer briefly and practically.',
                'End with a Sources section listing the URLs you used.',
                'Never invent deadlines, fees, or approval outcomes.',
            ],
        );
    }

    protected function tools(): array
    {
        return [
            Tool::make(
                'search_knowledge',
                'Search certified official knowledge chunks (DGES, DGE, AIMA, gov.pt, universities).'
            )
                ->addProperty(
                    ToolProperty::make('query', PropertyType::STRING, 'Search query', true)
                )
                ->setCallable(function (string $query): string {
                    $chunks = KnowledgeChunk::search($query, 5);

                    if ($chunks->isEmpty()) {
                        return json_encode(['matches' => [], 'note' => 'No certified chunks found.']);
                    }

                    return json_encode([
                        'matches' => $chunks->map(fn (KnowledgeChunk $chunk) => [
                            'title' => $chunk->source?->title,
                            'url' => $chunk->source?->url,
                            'authority' => $chunk->source?->authority,
                            'content' => $chunk->content,
                        ])->values()->all(),
                    ]);
                }),

            Tool::make(
                'get_roadmap_step',
                'Get a structured admission roadmap step by slug.'
            )
                ->addProperty(
                    ToolProperty::make(
                        'slug',
                        PropertyType::STRING,
                        'One of: eligibility, attestation, equivalency, substitution, gaes, finish',
                        true
                    )
                )
                ->setCallable(function (string $slug): string {
                    $step = RoadmapStep::query()
                        ->with('checklistItems')
                        ->where('slug', $slug)
                        ->first();

                    if (! $step) {
                        return json_encode(['error' => 'Step not found']);
                    }

                    return json_encode([
                        'slug' => $step->slug,
                        'title' => $step->title,
                        'summary' => $step->summary,
                        'intro' => $step->intro,
                        'checklist' => $step->checklistItems->pluck('label'),
                    ]);
                }),

            Tool::make(
                'list_official_links',
                'Return allowlisted official links for a topic.'
            )
                ->addProperty(
                    ToolProperty::make(
                        'topic',
                        PropertyType::STRING,
                        'Topic key: eligibility, equivalency, exams, aima, universities, calendar',
                        true
                    )
                )
                ->setCallable(function (string $topic): string {
                    $map = [
                        'eligibility' => [
                            ['title' => 'DGES International Students', 'url' => 'https://www.dges.gov.pt/en/pagina/international-students'],
                        ],
                        'equivalency' => [
                            ['title' => 'DGE Equivalence FAQ', 'url' => 'https://www.dge.mec.pt/faq-equivalence-foreign-qualifications'],
                            ['title' => 'gov.pt equivalence service', 'url' => 'https://www2.gov.pt/pt/servicos/pedir-equivalencia-de-habilitacoes-estrangeiras-do-ensino-basico-e-secundario'],
                        ],
                        'exams' => [
                            ['title' => 'DGES foreign exam substitution', 'url' => 'https://www.dges.gov.pt/pt/pagina/substituicao-de-provas-de-ingresso-por-exames-estrangeiros-0'],
                        ],
                        'aima' => [
                            ['title' => 'AIMA Studying', 'url' => 'https://aima.gov.pt/pt/estudar'],
                            ['title' => 'AIMA Art. 91', 'url' => 'https://aima.gov.pt/pt/estudar/autorizacao-de-residencia-emitida-a-estudantes-do-ensino-superior-art-91-o'],
                        ],
                        'universities' => [
                            ['title' => 'ULisboa access', 'url' => 'https://www.ulisboa.pt/en/info/access-and-admission-ulisboa-1st-and-2nd-cycles'],
                            ['title' => 'Coimbra applications', 'url' => 'https://www.uc.pt/en/applications/bachelors-and-integrated-masters-degrees/'],
                        ],
                        'calendar' => [
                            ['title' => 'DGES access calendar', 'url' => 'https://www.dges.gov.pt/pt/pagina/calendario-concurso-nacional-de-acesso-0?plid=593'],
                        ],
                    ];

                    return json_encode([
                        'links' => $map[$topic] ?? $map['eligibility'],
                    ]);
                }),
        ];
    }
}
