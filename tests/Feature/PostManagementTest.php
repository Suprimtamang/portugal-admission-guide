<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_superadmin_can_create_publish_and_list_posts(): void
    {
        $admin = User::factory()->superadmin()->create();

        $this->actingAs($admin)
            ->post(route('app.posts.store'), [
                'title' => 'GAES password tips for Portugal students',
                'slug' => '',
                'excerpt' => 'Short overview for applicants preparing GAES accounts.',
                'body' => '<p>Confirm details on the official portal and keep documents ready.</p>',
                'status' => 'published',
                'published_at' => null,
                'meta_title' => 'GAES password tips for Portugal national students',
                'meta_description' => 'Practical tips for creating and recovering GAES passwords while applying as a national student in Portugal.',
                'focus_keyword' => 'gaes password',
            ])
            ->assertRedirect(route('app.posts.index'));

        $post = Post::query()->first();
        $this->assertNotNull($post);
        $this->assertSame('gaes-password-tips-for-portugal-students', $post->slug);
        $this->assertSame('published', $post->status);
        $this->assertSame('gaes password', $post->focus_keyword);
        $this->assertNotNull($post->published_at);
        $this->assertSame($admin->id, $post->user_id);

        $this->actingAs($admin)
            ->get(route('app.posts.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('App/Admin/Posts/Index')
                ->has('posts.data', 1));

        $this->get(route('blog.show', $post->slug))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Blog/Show')
                ->where('post.seo.title', 'GAES password tips for Portugal national students'));
    }

    public function test_superadmin_can_update_and_delete_posts(): void
    {
        $admin = User::factory()->superadmin()->create();
        $post = Post::query()->create([
            'user_id' => $admin->id,
            'title' => 'Draft note',
            'slug' => 'draft-note',
            'excerpt' => null,
            'body' => 'Body',
            'status' => 'draft',
            'published_at' => null,
        ]);

        $this->actingAs($admin)
            ->put(route('app.posts.update', $post), [
                'title' => 'Updated note',
                'slug' => 'updated-note',
                'excerpt' => 'Excerpt',
                'body' => 'Updated body',
                'status' => 'draft',
                'published_at' => null,
            ])
            ->assertRedirect(route('app.posts.index'));

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => 'Updated note',
            'slug' => 'updated-note',
        ]);

        $this->actingAs($admin)
            ->delete(route('app.posts.destroy', $post))
            ->assertRedirect(route('app.posts.index'));

        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }

    public function test_applicant_cannot_manage_posts(): void
    {
        $user = User::factory()->create(['role' => UserRole::User]);

        $this->actingAs($user)
            ->get(route('app.posts.index'))
            ->assertForbidden();

        $this->actingAs($user)
            ->post(route('app.posts.store'), [
                'title' => 'Nope',
                'body' => 'Nope',
                'status' => 'draft',
            ])
            ->assertForbidden();
    }
}
