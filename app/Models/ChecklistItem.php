<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChecklistItem extends Model
{
    protected $fillable = [
        'roadmap_step_id',
        'label',
        'sort_order',
    ];

    public function roadmapStep(): BelongsTo
    {
        return $this->belongsTo(RoadmapStep::class);
    }

    public function userProgress(): HasMany
    {
        return $this->hasMany(UserProgress::class);
    }
}
