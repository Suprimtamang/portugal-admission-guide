<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\SupportTicket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SupportTicketTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_and_view_own_ticket(): void
    {
        $user = User::factory()->create(['role' => UserRole::User]);

        $this->actingAs($user)
            ->post(route('app.support.store'), [
                'subject' => 'Need help with GAES',
                'category' => 'application',
                'priority' => 'high',
                'body' => 'I cannot create a password on the portal.',
            ])
            ->assertRedirect();

        $ticket = SupportTicket::query()->first();
        $this->assertNotNull($ticket);

        $this->actingAs($user)
            ->get(route('app.support.show', $ticket))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('App/Support/Show')
                ->where('ticket.subject', 'Need help with GAES'));
    }

    public function test_superadmin_can_view_and_update_ticket_status(): void
    {
        $user = User::factory()->create(['role' => UserRole::User]);
        $admin = User::factory()->superadmin()->create();

        $ticket = SupportTicket::query()->create([
            'user_id' => $user->id,
            'subject' => 'Equivalency question',
            'category' => 'equivalency',
            'priority' => 'normal',
            'status' => 'open',
            'last_reply_at' => now(),
        ]);

        $this->actingAs($admin)
            ->patch(route('app.support.update', $ticket), [
                'status' => 'in_progress',
                'priority' => 'high',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('support_tickets', [
            'id' => $ticket->id,
            'status' => 'in_progress',
            'priority' => 'high',
            'assigned_admin_id' => $admin->id,
        ]);
    }

    public function test_user_cannot_view_another_users_ticket(): void
    {
        $owner = User::factory()->create(['role' => UserRole::User]);
        $other = User::factory()->create(['role' => UserRole::User]);

        $ticket = SupportTicket::query()->create([
            'user_id' => $owner->id,
            'subject' => 'Private',
            'category' => 'other',
            'priority' => 'low',
            'status' => 'open',
        ]);

        $this->actingAs($other)
            ->get(route('app.support.show', $ticket))
            ->assertForbidden();
    }

    public function test_dashboard_redirects_user_and_renders_desk_for_superadmin(): void
    {
        $user = User::factory()->create(['role' => UserRole::User]);
        $admin = User::factory()->superadmin()->create();

        $this->actingAs($user)
            ->get(route('app.dashboard'))
            ->assertRedirect(route('app.roadmap'));

        $this->actingAs($admin)
            ->get(route('app.dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('App/Admin/Desk'));
    }

    public function test_user_cannot_access_applicants(): void
    {
        $user = User::factory()->create(['role' => UserRole::User]);

        $this->actingAs($user)
            ->get(route('app.applicants.index'))
            ->assertForbidden();
    }
}
