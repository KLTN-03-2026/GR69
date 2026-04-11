<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = [
        'code', 'type', 'value', 'label', 'min_order', 'max_uses', 'used_count', 'is_active', 'expires_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'expires_at' => 'datetime',
        'value' => 'integer',
        'min_order' => 'integer',
        'max_uses' => 'integer',
        'used_count' => 'integer',
    ];

    public function isValid(): bool
    {
        if (!$this->is_active) return false;
        if ($this->expires_at && $this->expires_at->isPast()) return false;
        if ($this->max_uses > 0 && $this->used_count >= $this->max_uses) return false;
        return true;
    }

    public function calculateDiscount(int $subtotal): int
    {
        if ($this->type === 'percent') {
            return (int) round($subtotal * $this->value / 100);
        }
        return $this->value;
    }
}
