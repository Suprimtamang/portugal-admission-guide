<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function manageAdmins(User $actor): bool
    {
        return $actor->canManageAdmins();
    }

    public function promote(User $actor, User $target): bool
    {
        if (! $actor->canManageAdmins()) {
            return false;
        }

        return ! $target->isOwner();
    }

    public function demote(User $actor, User $target): bool
    {
        if (! $actor->canManageAdmins()) {
            return false;
        }

        return ! $target->isOwner();
    }
}
