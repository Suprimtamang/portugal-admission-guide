<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\ChecklistItem;
use App\Models\SupportTicket;
use App\Models\User;
use App\Models\UserProgress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user->isSuperAdmin()) {
            return redirect()->route('app.roadmap');
        }

        return $this->superadminDesk();
    }

    private function superadminDesk(): Response
    {
        $openStatuses = ['open', 'in_progress', 'waiting_user'];
        $checklistTotal = ChecklistItem::query()->count();

        $queue = SupportTicket::query()
            ->with(['user:id,name,email'])
            ->whereIn('status', $openStatuses)
            ->orderByRaw("CASE priority WHEN 'high' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END")
            ->latest('last_reply_at')
            ->latest()
            ->limit(12)
            ->get()
            ->map(fn (SupportTicket $ticket) => [
                'id' => $ticket->id,
                'subject' => $ticket->subject,
                'category' => $ticket->category,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'updated_at' => $ticket->updated_at?->toDateTimeString(),
                'user' => [
                    'id' => $ticket->user?->id,
                    'name' => $ticket->user?->name,
                    'email' => $ticket->user?->email,
                ],
            ]);

        $applicants = User::query()
            ->where('role', UserRole::User)
            ->latest()
            ->limit(8)
            ->get(['id', 'name', 'email', 'created_at'])
            ->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'created_at' => $u->created_at?->toDateString(),
                'open_tickets' => SupportTicket::query()
                    ->where('user_id', $u->id)
                    ->whereIn('status', $openStatuses)
                    ->count(),
                'progress_done' => UserProgress::query()
                    ->where('user_id', $u->id)
                    ->whereNotNull('completed_at')
                    ->count(),
                'progress_total' => $checklistTotal,
            ]);

        return Inertia::render('App/Admin/Desk', [
            'stats' => [
                'applicants' => User::query()->where('role', UserRole::User)->count(),
                'open_tickets' => SupportTicket::query()->whereIn('status', $openStatuses)->count(),
                'high_priority' => SupportTicket::query()
                    ->whereIn('status', $openStatuses)
                    ->where('priority', 'high')
                    ->count(),
                'resolved_week' => SupportTicket::query()
                    ->where('status', 'resolved')
                    ->where('updated_at', '>=', now()->subDays(7))
                    ->count(),
            ],
            'queue' => $queue,
            'applicants' => $applicants,
        ]);
    }
}
