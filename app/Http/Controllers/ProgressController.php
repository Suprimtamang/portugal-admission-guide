<?php

namespace App\Http\Controllers;

use App\Models\ChecklistItem;
use App\Models\UserProgress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    public function toggle(Request $request, ChecklistItem $checklistItem): RedirectResponse
    {
        $validated = $request->validate([
            'completed' => ['required', 'boolean'],
        ]);

        $user = $request->user();

        if ($validated['completed']) {
            UserProgress::query()->updateOrCreate(
                [
                    'user_id' => $user->id,
                    'checklist_item_id' => $checklistItem->id,
                ],
                [
                    'completed_at' => now(),
                ]
            );
        } else {
            UserProgress::query()
                ->where('user_id', $user->id)
                ->where('checklist_item_id', $checklistItem->id)
                ->delete();
        }

        return back();
    }
}
