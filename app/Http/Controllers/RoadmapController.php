<?php

namespace App\Http\Controllers;

use App\Models\RoadmapStep;
use App\Models\UserProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoadmapController extends Controller
{
    public function index(Request $request): Response
    {
        $steps = RoadmapStep::query()
            ->with('checklistItems')
            ->orderBy('sort_order')
            ->get();

        $completedIds = [];

        if ($request->user()) {
            $completedIds = UserProgress::query()
                ->where('user_id', $request->user()->id)
                ->whereNotNull('completed_at')
                ->pluck('checklist_item_id')
                ->all();
        }

        return Inertia::render('Roadmap/Index', [
            'steps' => $steps->map(fn (RoadmapStep $step) => [
                'id' => $step->id,
                'slug' => $step->slug,
                'title' => $step->title,
                'icon' => $step->icon,
                'summary' => $step->summary,
                'intro' => $step->intro,
                'meta' => $step->meta,
                'sort_order' => $step->sort_order,
                'checklist_items' => $step->checklistItems->map(fn ($item) => [
                    'id' => $item->id,
                    'label' => $item->label,
                    'sort_order' => $item->sort_order,
                    'completed' => in_array($item->id, $completedIds, true),
                ]),
            ]),
            'supportLinks' => [
                [
                    'label' => 'DGES e-balcão (BE-COM)',
                    'href' => 'https://www.dges.gov.pt/pt/pagina/be-com',
                    'primary' => true,
                ],
                [
                    'label' => 'Official Access Calendar',
                    'href' => 'https://www.dges.gov.pt/pt/pagina/calendario-concurso-nacional-de-acesso-0?plid=593',
                    'primary' => false,
                ],
                [
                    'label' => 'DGES Application Guide',
                    'href' => 'https://www.dges.gov.pt/pt/pagina/substituicao-de-provas-de-ingresso-por-exames-estrangeiros?plid=593',
                    'primary' => false,
                ],
            ],
            'contactEmail' => 's.tamang@campus.fct.unl.pt',
        ]);
    }
}
