<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id', 'total_amount', 'shipping_fee', 'coupon_code', 'discount',
        'status', 'shipping_name', 'shipping_phone', 'shipping_address',
        'payment_method', 'note',
    ];

    protected $casts = [
        'total_amount' => 'integer',
        'shipping_fee' => 'integer',
        'discount' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
