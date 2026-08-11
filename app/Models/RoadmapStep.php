<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RoadmapStep extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'icon',
        'summary',
        'intro',
        'meta',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'meta' => 'array',
        ];
    }

    public function checklistItems(): HasMany
    {
        return $this->hasMany(ChecklistItem::class)->orderBy('sort_order');
    }
}
