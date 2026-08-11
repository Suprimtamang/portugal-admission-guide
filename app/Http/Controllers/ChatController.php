<?php

namespace App\Http\Controllers;

use App\Services\AdmissionAgentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('App/Chat', [
            'disclaimer' => 'This assistant answers only from allowlisted official sources (DGES, DGE, AIMA, gov.pt, selected universities). It is not legal advice.',
        ]);
    }

    public function store(Request $request, AdmissionAgentService $agent): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
            'language' => ['nullable', 'string', 'max:32'],
        ]);

        $result = $agent->chat(
            $request->user(),
            $validated['message'],
            $validated['language'] ?? 'auto',
        );

        return response()->json($result);
    }
}
