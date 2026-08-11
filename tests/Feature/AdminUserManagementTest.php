<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_promote_and_demote_admins(): void
    {
        $owner = User::factory()->owner()->create();
        $applicant = User::factory()->create(['role' => UserRole::User]);

        $this->actingAs($owner)
            ->get(route('app.admins.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('App/Admin/Admins/Index'));

        $this->actingAs($owner)
            ->patch(route('app.admins.update', $applicant), ['role' => 'superadmin'])
            ->assertRedirect();

        $this->assertTrue($applicant->fresh()->isSuperAdmin());

        $this->actingAs($owner)
            ->patch(route('app.admins.update', $applicant), ['role' => 'user'])
            ->assertRedirect();

        $this->assertTrue($applicant->fresh()->isApplicant());
    }

    public function test_non_owner_superadmin_cannot_manage_admins(): void
    {
        $admin = User::factory()->superadmin()->create([
            'email' => 'other-admin@example.com',
        ]);
        $applicant = User::factory()->create(['role' => UserRole::User]);

        $this->actingAs($admin)
            ->get(route('app.admins.index'))
            ->assertForbidden();

        $this->actingAs($admin)
            ->patch(route('app.admins.update', $applicant), ['role' => 'superadmin'])
            ->assertForbidden();

        $this->assertTrue($applicant->fresh()->isApplicant());
    }

    public function test_owner_cannot_demote_themselves(): void
    {
        $owner = User::factory()->owner()->create();

        $this->actingAs($owner)
            ->patch(route('app.admins.update', $owner), ['role' => 'user'])
            ->assertForbidden();

        $this->assertTrue($owner->fresh()->isSuperAdmin());
    }

    public function test_applicant_cannot_access_admin_management(): void
    {
        $user = User::factory()->create(['role' => UserRole::User]);
        $target = User::factory()->create(['role' => UserRole::User]);

        $this->actingAs($user)
            ->get(route('app.admins.index'))
            ->assertForbidden();

        $this->actingAs($user)
            ->patch(route('app.admins.update', $target), ['role' => 'superadmin'])
            ->assertForbidden();
    }
}
