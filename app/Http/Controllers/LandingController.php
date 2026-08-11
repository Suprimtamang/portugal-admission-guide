<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Landing', [
            'features' => [
                [
                    'title' => 'Admission Roadmap',
                    'body' => 'Step-by-step National Student pathway: eligibility, documents, equivalency, exams, GAES, and application.',
                ],
                [
                    'title' => 'AIMA & Stay Guide',
                    'body' => 'Clear guidance on study visas vs residence permits, with links to official AIMA pages.',
                ],
                [
                    'title' => 'University Directory',
                    'body' => 'National vs International routes for ULisboa, Porto, Coimbra, and NOVA — with official deep links.',
                ],
                [
                    'title' => 'AI Admission Agent',
                    'body' => 'Ask questions in your language. Answers cite certified sources (DGES, DGE, AIMA) — or refuse when unsure.',
                ],
                [
                    'title' => 'Progress Tracking',
                    'body' => 'Save checklist progress to your account so you can continue across devices.',
                ],
                [
                    'title' => 'Guides & Blog',
                    'body' => 'Practical articles from the community, separate from official government corpus.',
                ],
            ],
            'latestPosts' => Post::query()
                ->published()
                ->latest('published_at')
                ->take(3)
                ->get(['title', 'slug', 'excerpt', 'published_at']),
            'lastReviewed' => now()->toDateString(),
        ]);
    }
}
