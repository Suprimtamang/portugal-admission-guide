<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class KnowledgeChunk extends Model
{
    protected $fillable = [
        'knowledge_source_id',
        'content',
        'chunk_index',
    ];

    protected static function booted(): void
    {
        static::saved(function (KnowledgeChunk $chunk): void {
            if (DB::connection()->getDriverName() !== 'pgsql') {
                return;
            }

            DB::table('knowledge_chunks')
                ->where('id', $chunk->id)
                ->update([
                    'search_vector' => DB::raw("to_tsvector('english', coalesce(content, ''))"),
                ]);
        });
    }

    public function source(): BelongsTo
    {
        return $this->belongsTo(KnowledgeSource::class, 'knowledge_source_id');
    }

    public static function search(string $query, int $limit = 5): Collection
    {
        $terms = collect(preg_split('/\s+/', strtolower(trim($query))))
            ->map(fn (string $term) => preg_replace('/[^a-z0-9_-]/', '', $term))
            ->filter(fn (?string $term) => $term !== null && strlen($term) > 2)
            ->unique()
            ->take(8)
            ->values();

        if ($terms->isEmpty() || DB::connection()->getDriverName() !== 'pgsql') {
            return static::query()
                ->with('source')
                ->where(function ($builder) use ($query, $terms): void {
                    if ($terms->isEmpty()) {
                        $builder->where('content', 'ilike', '%'.mb_substr($query, 0, 40).'%');

                        return;
                    }

                    foreach ($terms as $term) {
                        $builder->orWhere('content', 'like', '%'.$term.'%');
                    }
                })
                ->limit($limit)
                ->get();
        }

        $tsQuery = $terms->map(fn (string $term) => $term.':*')->implode(' | ');

        try {
            return static::query()
                ->with('source')
                ->whereRaw("search_vector @@ to_tsquery('english', ?)", [$tsQuery])
                ->orderByRaw("ts_rank(search_vector, to_tsquery('english', ?)) DESC", [$tsQuery])
                ->limit($limit)
                ->get();
        } catch (\Throwable) {
            return static::query()
                ->with('source')
                ->where(function ($builder) use ($terms): void {
                    foreach ($terms as $term) {
                        $builder->orWhere('content', 'ilike', '%'.$term.'%');
                    }
                })
                ->limit($limit)
                ->get();
        }
    }
}
