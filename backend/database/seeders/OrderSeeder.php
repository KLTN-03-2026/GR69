<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $orders = [
            [
                'user_id' => 2, 'total_amount' => 1280000, 'shipping_fee' => 30000,
                'coupon_code' => null, 'discount' => 0, 'status' => 'delivered',
                'shipping_name' => 'Nguyễn Văn An', 'shipping_phone' => '0912345678',
                'shipping_address' => '456 Lê Lợi, Quận 3, TP.HCM',
                'payment_method' => 'cod', 'note' => 'Giao giờ hành chính',
                'created_at' => '2024-12-15 10:30:00',
                'items' => [
                    ['product_id' => 1, 'product_name' => 'Tôm sú tươi sống', 'price' => 350000, 'quantity' => 2],
                    ['product_id' => 6, 'product_name' => 'Cá hồi Na Uy nguyên con', 'price' => 580000, 'quantity' => 1],
                ],
            ],
            [
                'user_id' => 3, 'total_amount' => 1350000, 'shipping_fee' => 0,
                'coupon_code' => 'FREESHIP', 'discount' => 30000, 'status' => 'shipping',
                'shipping_name' => 'Trần Thị Bích', 'shipping_phone' => '0987654321',
                'shipping_address' => '12 Hoàng Sa, Quận Tân Bình, TP.HCM',
                'payment_method' => 'banking', 'note' => null,
                'created_at' => '2025-01-20 14:15:00',
                'items' => [
                    ['product_id' => 10, 'product_name' => 'Cua thịt Cà Mau', 'price' => 650000, 'quantity' => 1],
                    ['product_id' => 17, 'product_name' => 'Ốc hương', 'price' => 350000, 'quantity' => 2],
                ],
            ],
            [
                'user_id' => 4, 'total_amount' => 1500000, 'shipping_fee' => 0,
                'coupon_code' => null, 'discount' => 0, 'status' => 'processing',
                'shipping_name' => 'Lê Hoàng Nam', 'shipping_phone' => '0976543210',
                'shipping_address' => '34 Nguyễn Trãi, Quận Hà Đông, Hà Nội',
                'payment_method' => 'ewallet', 'note' => 'Giao trước 5h chiều',
                'created_at' => '2025-03-01 09:00:00',
                'items' => [
                    ['product_id' => 23, 'product_name' => 'Set hải sản cao cấp BBQ', 'price' => 1500000, 'quantity' => 1],
                ],
            ],
            [
                'user_id' => 2, 'total_amount' => 2210000, 'shipping_fee' => 0,
                'coupon_code' => 'SALE10', 'discount' => 221000, 'status' => 'pending',
                'shipping_name' => 'Nguyễn Văn An', 'shipping_phone' => '0912345678',
                'shipping_address' => '789 Trần Hưng Đạo, Quận 5, TP.HCM',
                'payment_method' => 'cod', 'note' => null,
                'created_at' => '2025-03-28 16:45:00',
                'items' => [
                    ['product_id' => 3, 'product_name' => 'Tôm hùm bông', 'price' => 1200000, 'quantity' => 1],
                    ['product_id' => 16, 'product_name' => 'Sò điệp Hokkaido', 'price' => 450000, 'quantity' => 1],
                    ['product_id' => 8, 'product_name' => 'Cá ngừ đại dương', 'price' => 280000, 'quantity' => 2],
                ],
            ],
            [
                'user_id' => 5, 'total_amount' => 4300000, 'shipping_fee' => 0,
                'coupon_code' => null, 'discount' => 0, 'status' => 'cancelled',
                'shipping_name' => 'Phạm Minh Tú', 'shipping_phone' => '0965432109',
                'shipping_address' => '56 Lý Thường Kiệt, Quận 10, TP.HCM',
                'payment_method' => 'banking', 'note' => 'Hủy do không liên lạc được',
                'created_at' => '2025-02-14 11:20:00',
                'items' => [
                    ['product_id' => 12, 'product_name' => 'Cua Hoàng Đế Alaska', 'price' => 2500000, 'quantity' => 1],
                    ['product_id' => 21, 'product_name' => 'Tôm hùm Alaska', 'price' => 1800000, 'quantity' => 1],
                ],
            ],
            [
                'user_id' => 3, 'total_amount' => 1300000, 'shipping_fee' => 30000,
                'coupon_code' => null, 'discount' => 0, 'status' => 'delivered',
                'shipping_name' => 'Trần Thị Bích', 'shipping_phone' => '0987654321',
                'shipping_address' => '12 Hoàng Sa, Quận Tân Bình, TP.HCM',
                'payment_method' => 'cod', 'note' => null,
                'created_at' => '2025-01-05 08:30:00',
                'items' => [
                    ['product_id' => 22, 'product_name' => 'Cá hồi sashimi cắt lát', 'price' => 380000, 'quantity' => 2],
                    ['product_id' => 19, 'product_name' => 'Hàu sữa Vân Đồn', 'price' => 180000, 'quantity' => 3],
                ],
            ],
        ];

        foreach ($orders as $orderData) {
            $items = $orderData['items'];
            unset($orderData['items']);
            $order = Order::create($orderData);

            foreach ($items as $item) {
                $order->items()->create($item);
            }
        }
    }
}
