<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('q')->trim()->toString();

        $posts = Post::query()
            ->with('author:id,name')
            ->when(
                $search !== '',
                fn ($q) => $q->where(function ($inner) use ($search) {
                    $inner->where('title', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                }),
            )
            ->latest()
            ->paginate(15)
            ->through(fn (Post $post) => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'status' => $post->status,
                'seo_title' => $post->meta_title ?: $post->title,
                'cover_image_url' => $this->coverUrl($post),
                'published_at' => $post->published_at?->toDateTimeString(),
                'author' => $post->author?->name,
                'updated_at' => $post->updated_at?->toDateString(),
            ]);

        return Inertia::render('App/Admin/Posts/Index', [
            'posts' => $posts,
            'filters' => ['q' => $search ?: null],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('App/Admin/Posts/Form', [
            'post' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['user_id'] = $request->user()->id;
        $data = $this->normalizePublishState($data);
        $data = $this->applyCoverImage($request, $data);

        Post::query()->create($data);

        return redirect()
            ->route('app.posts.index')
            ->with('success', 'Post created.');
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('App/Admin/Posts/Form', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt ?? '',
                'body' => $post->body,
                'status' => $post->status,
                'published_at' => $post->published_at?->format('Y-m-d\TH:i'),
                'meta_title' => $post->meta_title ?? '',
                'meta_description' => $post->meta_description ?? '',
                'focus_keyword' => $post->focus_keyword ?? '',
                'cover_image_url' => $this->coverUrl($post),
            ],
        ]);
    }

    public function update(Request $request, Post $post): RedirectResponse
    {
        $data = $this->validated($request, $post);
        $data = $this->normalizePublishState($data);
        $data = $this->applyCoverImage($request, $data, $post);

        $post->update($data);

        return redirect()
            ->route('app.posts.index')
            ->with('success', 'Post updated.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        if ($post->cover_image) {
            Storage::disk('public')->delete($post->cover_image);
        }

        $post->delete();

        return redirect()
            ->route('app.posts.index')
            ->with('success', 'Post deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Post $post = null): array
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:2000'],
            'body' => ['required', 'string'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'published_at' => ['nullable', 'date'],
            'meta_title' => ['nullable', 'string', 'max:70'],
            'meta_description' => ['nullable', 'string', 'max:180'],
            'focus_keyword' => ['nullable', 'string', 'max:100'],
            'cover_image' => ['nullable', 'image', 'max:4096'],
            'remove_cover_image' => ['nullable', 'boolean'],
        ]);

        $slug = filled($validated['slug'] ?? null)
            ? Str::slug($validated['slug'])
            : Str::slug($validated['title']);

        $request->merge(['slug' => $slug]);

        $request->validate([
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('posts', 'slug')->ignore($post?->id),
            ],
        ]);

        $validated['slug'] = $slug;
        unset($validated['cover_image'], $validated['remove_cover_image']);

        return $validated;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function normalizePublishState(array $data): array
    {
        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        if ($data['status'] === 'draft') {
            $data['published_at'] = $data['published_at'] ?? null;
        }

        return $data;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function applyCoverImage(Request $request, array $data, ?Post $post = null): array
    {
        if ($request->boolean('remove_cover_image') && $post?->cover_image) {
            Storage::disk('public')->delete($post->cover_image);
            $data['cover_image'] = null;
        }

        if ($request->hasFile('cover_image')) {
            if ($post?->cover_image) {
                Storage::disk('public')->delete($post->cover_image);
            }

            $data['cover_image'] = $request->file('cover_image')->store('posts', 'public');
        }

        return $data;
    }

    private function coverUrl(Post $post): ?string
    {
        if (! $post->cover_image) {
            return null;
        }

        return Storage::disk('public')->url($post->cover_image);
    }
}
