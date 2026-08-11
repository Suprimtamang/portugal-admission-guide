<?php

namespace App\Policies;

use App\Models\SupportTicket;
use App\Models\User;

class SupportTicketPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, SupportTicket $ticket): bool
    {
        return $user->isSuperAdmin() || $ticket->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function reply(User $user, SupportTicket $ticket): bool
    {
        return $this->view($user, $ticket);
    }

    public function updateStatus(User $user, SupportTicket $ticket): bool
    {
        return $user->isSuperAdmin();
    }
}
