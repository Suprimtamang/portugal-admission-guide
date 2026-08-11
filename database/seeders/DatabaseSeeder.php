<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call(RoadmapSeeder::class);
        $this->call(KnowledgeSeeder::class);

        User::query()->updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'role' => UserRole::Superadmin,
            ],
        );

        User::query()->updateOrCreate(
            ['email' => 'applicant@example.com'],
            [
                'name' => 'Applicant User',
                'password' => Hash::make('password'),
                'role' => UserRole::User,
            ],
        );

        $this->call(BlogSeeder::class);
    }
}
