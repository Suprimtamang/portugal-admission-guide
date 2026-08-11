<?php

namespace Tests\Feature;

use App\Models\ChecklistItem;
use App\Models\RoadmapStep;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProgressToggleTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_toggle_progress(): void
    {
        $step = RoadmapStep::query()->create([
            'slug' => 'attestation',
            'title' => '1. Document Attestation',
            'icon' => '📄',
            'summary' => 'Legalizing Certificates',
            'intro' => 'Intro',
            'meta' => ['type' => 'checklist'],
            'sort_order' => 1,
        ]);

        $item = ChecklistItem::query()->create([
            'roadmap_step_id' => $step->id,
            'label' => 'Board certificates',
            'sort_order' => 0,
        ]);

        $this->post(route('progress.toggle', $item), ['completed' => true])
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_toggle_progress(): void
    {
        $user = User::factory()->create();

        $step = RoadmapStep::query()->create([
            'slug' => 'attestation',
            'title' => '1. Document Attestation',
            'icon' => '📄',
            'summary' => 'Legalizing Certificates',
            'intro' => 'Intro',
            'meta' => ['type' => 'checklist'],
            'sort_order' => 1,
        ]);

        $item = ChecklistItem::query()->create([
            'roadmap_step_id' => $step->id,
            'label' => 'Board certificates',
            'sort_order' => 0,
        ]);

        $this->actingAs($user)
            ->post(route('progress.toggle', $item), ['completed' => true])
            ->assertRedirect();

        $this->assertDatabaseHas('user_progress', [
            'user_id' => $user->id,
            'checklist_item_id' => $item->id,
        ]);

        $this->actingAs($user)
            ->post(route('progress.toggle', $item), ['completed' => false])
            ->assertRedirect();

        $this->assertDatabaseMissing('user_progress', [
            'user_id' => $user->id,
            'checklist_item_id' => $item->id,
        ]);
    }

    public function test_roadmap_requires_authentication(): void
    {
        $this->seed(\Database\Seeders\RoadmapSeeder::class);

        $this->get(route('app.roadmap'))->assertRedirect(route('login'));
    }

    public function test_roadmap_page_loads_for_authenticated_users(): void
    {
        $this->seed(\Database\Seeders\RoadmapSeeder::class);
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('app.roadmap'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Roadmap/Index')
                ->has('steps', 6)
            );
    }
}
