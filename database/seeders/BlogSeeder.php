<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->where('email', 'test@example.com')->first();

        Post::query()->updateOrCreate(
            ['slug' => 'national-vs-international-student'],
            [
                'user_id' => $admin?->id,
                'title' => 'National vs International Student pathway in Portugal',
                'excerpt' => 'A plain-language overview of why residency status can change your tuition and contest route.',
                'body' => "If you are a non-EU resident who has lived legally in Portugal for more than two uninterrupted years as of 1 January of the application year (or you are a child living with such a resident), you may be excluded from International Student status and able to use the National Call.\n\nAlways confirm on DGES and your target university pages. This blog post is editorial guidance, not official advice.",
                'status' => 'published',
                'published_at' => now()->subDay(),
            ]
        );
    }
}
