<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $orders = [
            [
                'id' => 1,
                'user_id' => 4,
                'total_amount' => 2376000,
                'shipping_fee' => 0,
                'coupon_code' => 'GIAMGIA50K',
                'discount' => 50000,
                'status' => 'delivered',
                'shipping_name' => 'Le Minh Hai',
                'shipping_phone' => '0973627203',
                'shipping_address' => 'Tu Chanh, Phong Thai, Tp.Hue',
                'payment_method' => 'cod',
                'note' => null,
                'created_at' => '2026-04-12 08:19:35',
                'updated_at' => '2026-04-23 09:56:11',
            ],
            [
                'id' => 2,
                'user_id' => 4,
                'total_amount' => 2339000,
                'shipping_fee' => 0,
                'coupon_code' => 'GIAMGIA50K',
                'discount' => 50000,
                'status' => 'cancelled',
                'shipping_name' => 'Le Minh Hai',
                'shipping_phone' => '0973627203',
                'shipping_address' => 'Tu Chanh, Phong Thai, Tp.Hue',
                'payment_method' => 'cod',
                'note' => null,
                'created_at' => '2026-04-13 02:30:15',
                'updated_at' => '2026-04-13 03:06:36',
            ],
            [
                'id' => 3,
                'user_id' => 4,
                'total_amount' => 560000,
                'shipping_fee' => 0,
                'coupon_code' => 'GIAMGIA50K',
                'discount' => 50000,
                'status' => 'cancelled',
                'shipping_name' => 'Le Minh Hai',
                'shipping_phone' => '0973627203',
                'shipping_address' => '12 hoa nam, Hoa Minh, Lien Chieu, Da Nang',
                'payment_method' => 'cod',
                'note' => null,
                'created_at' => '2026-04-13 03:09:41',
                'updated_at' => '2026-04-13 03:17:24',
            ],
            [
                'id' => 4,
                'user_id' => 4,
                'total_amount' => 607000,
                'shipping_fee' => 0,
                'coupon_code' => 'GIAMGIA50K',
                'discount' => 50000,
                'status' => 'delivered',
                'shipping_name' => 'Le Minh Hai',
                'shipping_phone' => '0973627203',
                'shipping_address' => 'Tu Chanh, Phong Thai, Tp.Hue',
                'payment_method' => 'cod',
                'note' => null,
                'created_at' => '2026-04-15 01:39:49',
                'updated_at' => '2026-04-15 01:40:30',
            ],
            [
                'id' => 5,
                'user_id' => 4,
                'total_amount' => 1474000,
                'shipping_fee' => 0,
                'coupon_code' => 'GIAMGIA50K',
                'discount' => 50000,
                'status' => 'delivered',
                'shipping_name' => 'Le Minh Hai',
                'shipping_phone' => '0973627203',
                'shipping_address' => 'Tu Chanh, Phong Thai, Tp.Hue',
                'payment_method' => 'cod',
                'note' => null,
                'created_at' => '2026-04-15 03:40:14',
                'updated_at' => '2026-04-15 03:57:14',
            ],
            [
                'id' => 6,
                'user_id' => 4,
                'total_amount' => 346000,
                'shipping_fee' => 30000,
                'coupon_code' => null,
                'discount' => 0,
                'status' => 'delivered',
                'shipping_name' => 'Le Minh Hai',
                'shipping_phone' => '0973627203',
                'shipping_address' => 'Tu Chanh, Phong Thai, Tp.Hue',
                'payment_method' => 'cod',
                'note' => null,
                'created_at' => '2026-04-16 10:04:11',
                'updated_at' => '2026-04-16 12:59:38',
            ]
        ];

        Order::insert($orders);
    }
}