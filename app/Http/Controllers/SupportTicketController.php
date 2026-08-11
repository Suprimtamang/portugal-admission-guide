<?php

namespace App\Http\Controllers;

use App\Models\SupportMessage;
use App\Models\SupportTicket;
use App\Models\UserProgress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SupportTicketController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', SupportTicket::class);

        $user = $request->user();
        $isSuper = $user->isSuperAdmin();

        $tickets = SupportTicket::query()
            ->when(
                ! $isSuper,
                fn ($q) => $q->where('user_id', $user->id),
            )
            ->when(
                $isSuper,
                fn ($q) => $q->with(['user:id,name,email']),
            )
            ->when(
                $request->string('status')->isNotEmpty(),
                fn ($q) => $q->where('status', $request->string('status')),
            )
            ->latest('last_reply_at')
            ->latest()
            ->paginate(20)
            ->through(fn (SupportTicket $ticket) => [
                'id' => $ticket->id,
                'subject' => $ticket->subject,
                'category' => $ticket->category,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'updated_at' => $ticket->updated_at?->toDateTimeString(),
                'last_reply_at' => $ticket->last_reply_at?->toDateTimeString(),
                'user' => $isSuper ? [
                    'id' => $ticket->user?->id,
                    'name' => $ticket->user?->name,
                    'email' => $ticket->user?->email,
                ] : null,
            ]);

        return Inertia::render('App/Support/Index', [
            'tickets' => $tickets,
            'filters' => [
                'status' => $request->string('status')->toString() ?: null,
            ],
            'isSuperAdmin' => $isSuper,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', SupportTicket::class);

        return Inertia::render('App/Support/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', SupportTicket::class);

        $data = $request->validate([
            'subject' => ['required', 'string', 'max:160'],
            'category' => ['required', Rule::in(['application', 'documents', 'aima', 'equivalency', 'other'])],
            'priority' => ['required', Rule::in(['low', 'normal', 'high'])],
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $ticket = SupportTicket::query()->create([
            'user_id' => $request->user()->id,
            'subject' => $data['subject'],
            'category' => $data['category'],
            'priority' => $data['priority'],
            'status' => 'open',
            'last_reply_at' => now(),
        ]);

        SupportMessage::query()->create([
            'support_ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'is_staff' => false,
            'body' => $data['body'],
        ]);

        return redirect()
            ->route('app.support.show', $ticket)
            ->with('success', 'Help request sent. An admin will reply here.');
    }

    public function show(Request $request, SupportTicket $ticket): Response
    {
        $this->authorize('view', $ticket);

        $ticket->load([
            'user:id,name,email',
            'assignedAdmin:id,name',
            'messages.user:id,name',
        ]);

        $applicantProgress = null;
        if ($request->user()->isSuperAdmin()) {
            $applicantProgress = [
                'done' => UserProgress::query()
                    ->where('user_id', $ticket->user_id)
                    ->whereNotNull('completed_at')
                    ->count(),
                'total' => \App\Models\ChecklistItem::query()->count(),
            ];
        }

        return Inertia::render('App/Support/Show', [
            'ticket' => [
                'id' => $ticket->id,
                'subject' => $ticket->subject,
                'category' => $ticket->category,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'created_at' => $ticket->created_at?->toDateTimeString(),
                'user' => [
                    'id' => $ticket->user?->id,
                    'name' => $ticket->user?->name,
                    'email' => $ticket->user?->email,
                ],
                'assigned_admin' => $ticket->assignedAdmin
                    ? ['id' => $ticket->assignedAdmin->id, 'name' => $ticket->assignedAdmin->name]
                    : null,
                'messages' => $ticket->messages->map(fn (SupportMessage $message) => [
                    'id' => $message->id,
                    'body' => $message->body,
                    'is_staff' => $message->is_staff,
                    'created_at' => $message->created_at?->toDateTimeString(),
                    'author' => $message->user?->name,
                ]),
            ],
            'applicantProgress' => $applicantProgress,
            'isSuperAdmin' => $request->user()->isSuperAdmin(),
            'statuses' => ['open', 'in_progress', 'waiting_user', 'resolved', 'closed'],
        ]);
    }

    public function reply(Request $request, SupportTicket $ticket): RedirectResponse
    {
        $this->authorize('reply', $ticket);

        $data = $request->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $isSuper = $request->user()->isSuperAdmin();

        SupportMessage::query()->create([
            'support_ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'is_staff' => $isSuper,
            'body' => $data['body'],
        ]);

        $ticket->update([
            'last_reply_at' => now(),
            'status' => $isSuper
                ? ($ticket->status === 'open' ? 'in_progress' : $ticket->status)
                : 'open',
            'assigned_admin_id' => $isSuper
                ? ($ticket->assigned_admin_id ?: $request->user()->id)
                : $ticket->assigned_admin_id,
        ]);

        return back();
    }

    public function updateStatus(Request $request, SupportTicket $ticket): RedirectResponse
    {
        $this->authorize('updateStatus', $ticket);

        $data = $request->validate([
            'status' => ['required', Rule::in(['open', 'in_progress', 'waiting_user', 'resolved', 'closed'])],
            'priority' => ['sometimes', Rule::in(['low', 'normal', 'high'])],
        ]);

        $ticket->update([
            'status' => $data['status'],
            'priority' => $data['priority'] ?? $ticket->priority,
            'assigned_admin_id' => $ticket->assigned_admin_id ?: $request->user()->id,
        ]);

        return back();
    }
}
