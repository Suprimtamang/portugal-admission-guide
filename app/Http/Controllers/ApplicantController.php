<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\ChecklistItem;
use App\Models\SupportTicket;
use App\Models\User;
use App\Models\UserProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicantController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('q')->trim()->toString();
        $checklistTotal = ChecklistItem::query()->count();
        $openStatuses = ['open', 'in_progress', 'waiting_user'];

        $applicants = User::query()
            ->where('role', UserRole::User)
                ->when(
                $search !== '',
                fn ($q) => $q->where(function ($inner) use ($search) {
                    $inner->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                }),
            )
            ->latest()
            ->paginate(20)
            ->through(fn (User $u) => [
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

        return Inertia::render('App/Admin/Applicants/Index', [
            'applicants' => $applicants,
            'filters' => ['q' => $search ?: null],
        ]);
    }

    public function show(User $user): Response
    {
        abort_unless($user->isApplicant(), 404);

        $checklistTotal = ChecklistItem::query()->count();
        $progressDone = UserProgress::query()
            ->where('user_id', $user->id)
            ->whereNotNull('completed_at')
            ->count();

        $tickets = SupportTicket::query()
            ->where('user_id', $user->id)
            ->latest()
            ->get(['id', 'subject', 'status', 'priority', 'category', 'updated_at'])
            ->map(fn (SupportTicket $ticket) => [
                'id' => $ticket->id,
                'subject' => $ticket->subject,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'category' => $ticket->category,
                'updated_at' => $ticket->updated_at?->toDateTimeString(),
            ]);

        return Inertia::render('App/Admin/Applicants/Show', [
            'applicant' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at?->toDateString(),
                'progress_done' => $progressDone,
                'progress_total' => $checklistTotal,
            ],
            'tickets' => $tickets,
        ]);
    }
}
