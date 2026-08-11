<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call(RoadmapSeeder::class);
        $this->call(KnowledgeSeeder::class);

        User::factory()->superadmin()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        User::factory()->create([
            'name' => 'Applicant User',
            'email' => 'applicant@example.com',
            'password' => 'password',
            'role' => UserRole::User,
        ]);

        $this->call(BlogSeeder::class);
    }
}
