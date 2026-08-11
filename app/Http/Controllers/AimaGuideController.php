<?php

namespace App\Http\Controllers;

use App\Models\UserDocumentCheck;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AimaGuideController extends Controller
{
    private const DOCUMENTS = [
        ['key' => 'passport', 'label' => 'Valid passport'],
        ['key' => 'enrolment', 'label' => 'Proof of enrolment / acceptance letter'],
        ['key' => 'tuition', 'label' => 'Tuition payment proof (if required)'],
        ['key' => 'accommodation', 'label' => 'Accommodation proof'],
        ['key' => 'subsistence', 'label' => 'Means of subsistence'],
        ['key' => 'insurance', 'label' => 'Health insurance or SNS coverage'],
        ['key' => 'appointment', 'label' => 'AIMA appointment confirmation'],
    ];

    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $existing = UserDocumentCheck::query()
            ->where('user_id', $user->id)
            ->get()
            ->keyBy('document_key');

        $documents = collect(self::DOCUMENTS)->map(function (array $doc) use ($existing) {
            $row = $existing->get($doc['key']);

            return [
                'key' => $doc['key'],
                'label' => $doc['label'],
                'completed' => $row?->completed_at !== null,
            ];
        });

        return Inertia::render('App/Aima', [
            'lastUpdated' => '11 Aug 2026',
            'documents' => $documents,
            'sections' => [
                [
                    'title' => 'Study visa (before travel)',
                    'body' => 'Non-EU students usually apply for a residence visa for study at a Portuguese consulate/embassy before travelling. Start early — processing can take months.',
                    'official' => true,
                ],
                [
                    'title' => 'AIMA residence permit (after arrival)',
                    'body' => 'After entering Portugal, book an AIMA appointment (or use the electronic platform when available) to request a residence permit for higher education (commonly Art. 91.º) or other student categories (Art. 92.º).',
                    'official' => true,
                ],
                [
                    'title' => 'Typical supporting documents',
                    'body' => 'Expect proof of enrolment, tuition payment (if required), accommodation, means of subsistence, health insurance or SNS coverage, and identity documents. Exact lists are on AIMA — always confirm before your appointment.',
                    'official' => true,
                ],
                [
                    'title' => 'Community tip',
                    'body' => 'Incomplete files are often refused at the counter. Print appointment proof and bring originals + copies.',
                    'official' => false,
                ],
            ],
            'links' => [
                [
                    'label' => 'AIMA — Studying',
                    'href' => 'https://aima.gov.pt/pt/estudar',
                ],
                [
                    'label' => 'AIMA — Higher education residence (Art. 91.º)',
                    'href' => 'https://aima.gov.pt/pt/estudar/autorizacao-de-residencia-emitida-a-estudantes-do-ensino-superior-art-91-o',
                ],
                [
                    'label' => 'NOVA FCT visa & residence overview',
                    'href' => 'https://www.fct.unl.pt/en/international/visa-and-residence-permit',
                ],
            ],
        ]);
    }

    public function toggleDocument(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'document_key' => ['required', 'string'],
            'completed' => ['required', 'boolean'],
        ]);

        $meta = collect(self::DOCUMENTS)->firstWhere('key', $data['document_key']);
        abort_unless($meta, 422);

        $check = UserDocumentCheck::query()->firstOrNew([
            'user_id' => $request->user()->id,
            'document_key' => $data['document_key'],
        ]);
        $check->label = $meta['label'];
        $check->completed_at = $data['completed'] ? now() : null;
        $check->save();

        return back();
    }
}
