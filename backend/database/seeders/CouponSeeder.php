<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        $coupons = [
            ['code' => 'FREESHIP', 'type' => 'fixed', 'value' => 30000, 'label' => 'Miễn phí ship', 'min_order' => 0, 'max_uses' => 0, 'is_active' => true],
            ['code' => 'SALE10', 'type' => 'percent', 'value' => 10, 'label' => 'Giảm 10%', 'min_order' => 200000, 'max_uses' => 0, 'is_active' => true],
            ['code' => 'SALE20', 'type' => 'percent', 'value' => 20, 'label' => 'Giảm 20%', 'min_order' => 500000, 'max_uses' => 100, 'is_active' => true],
            ['code' => 'GIAM50K', 'type' => 'fixed', 'value' => 50000, 'label' => 'Giảm 50.000đ', 'min_order' => 300000, 'max_uses' => 0, 'is_active' => true],
        ];

        foreach ($coupons as $coupon) {
            Coupon::create($coupon);
        }
    }
}
