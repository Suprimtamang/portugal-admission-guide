<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('manageAdmins', User::class);

        $admins = User::query()
            ->where('role', UserRole::Superadmin)
            ->orderBy('name')
            ->get()
            ->sortByDesc(fn (User $user) => $user->isOwner())
            ->values()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_owner' => $user->isOwner(),
                'created_at' => $user->created_at?->toDateString(),
            ]);

        $candidates = User::query()
            ->where('role', UserRole::User)
            ->orderBy('name')
            ->limit(50)
            ->get(['id', 'name', 'email'])
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]);

        return Inertia::render('App/Admin/Admins/Index', [
            'admins' => $admins,
            'candidates' => $candidates,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', Rule::enum(UserRole::class)],
        ]);

        $role = UserRole::from($validated['role']);

        if ($role === UserRole::Superadmin) {
            $this->authorize('promote', $user);
        } else {
            $this->authorize('demote', $user);
        }

        abort_if($user->isOwner() && $role !== UserRole::Superadmin, 403);

        $user->assignRole($role);

        return back()->with(
            'success',
            $role === UserRole::Superadmin
                ? "{$user->name} is now a superadmin."
                : "{$user->name} is now an applicant.",
        );
    }
}
