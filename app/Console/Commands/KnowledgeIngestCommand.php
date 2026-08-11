<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class KnowledgeIngestCommand extends Command
{
    protected $signature = 'knowledge:ingest';

    protected $description = 'Re-seed certified knowledge chunks from the curated official corpus';

    public function handle(): int
    {
        $this->call('db:seed', ['--class' => 'Database\\Seeders\\KnowledgeSeeder', '--force' => true]);
        $this->info('Knowledge corpus refreshed. last_reviewed='.now()->toDateTimeString());

        return self::SUCCESS;
    }
}
