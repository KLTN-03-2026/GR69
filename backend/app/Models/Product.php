<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'name', 'slug', 'price', 'original_price', 'description',
        'origin', 'weight', 'unit', 'type', 'is_best_seller', 'is_new', 'stock', 'rating',
    ];

    protected $casts = [
        'is_best_seller' => 'boolean',
        'is_new' => 'boolean',
        'price' => 'integer',
        'original_price' => 'integer',
        'stock' => 'integer',
        'rating' => 'decimal:1',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function approvedReviews()
    {
        return $this->hasMany(Review::class)->where('status', 'approved');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function updateRating(): void
    {
        $this->rating = $this->approvedReviews()->avg('rating') ?? 0;
        $this->save();
    }
}
