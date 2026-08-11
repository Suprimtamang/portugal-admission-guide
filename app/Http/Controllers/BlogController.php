<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(): Response
    {
        $posts = Post::query()
            ->published()
            ->latest('published_at')
            ->get()
            ->map(fn (Post $post) => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'cover_image_url' => $this->coverUrl($post),
                'published_at' => optional($post->published_at)->toDateString(),
            ]);

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
        ]);
    }

    public function show(string $slug): Response
    {
        $post = Post::query()
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        $seoTitle = $post->meta_title ?: $post->title;
        $plainBody = trim(preg_replace('/\s+/', ' ', strip_tags($post->body)) ?? '');
        $seoDescription = $post->meta_description
            ?: ($post->excerpt ?: Str::limit($plainBody, 160, ''));
        $coverUrl = $this->coverUrl($post);

        return Inertia::render('Blog/Show', [
            'post' => [
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'body' => $post->body,
                'body_is_html' => (bool) preg_match('/<\/?[a-z][\s\S]*>/i', $post->body),
                'cover_image_url' => $coverUrl,
                'published_at' => optional($post->published_at)->toDateString(),
                'seo' => [
                    'title' => $seoTitle,
                    'description' => $seoDescription,
                    'canonical' => url('/blog/'.$post->slug),
                    'image' => $coverUrl,
                ],
            ],
        ]);
    }

    private function coverUrl(Post $post): ?string
    {
        if (! $post->cover_image) {
            return null;
        }

        return Storage::disk('public')->url($post->cover_image);
    }
}
