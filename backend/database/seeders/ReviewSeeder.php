<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $reviews = [
            ['product_id' => 1, 'user_id' => 2, 'rating' => 5, 'comment' => 'Tôm rất tươi, thịt chắc ngọt. Giao hàng nhanh, đóng gói cẩn thận. Sẽ mua lại!', 'status' => 'approved', 'created_at' => '2024-12-20'],
            ['product_id' => 1, 'user_id' => 3, 'rating' => 4, 'comment' => 'Tôm ngon, nhưng hơi ít so với 1kg. Nhìn chung hài lòng.', 'status' => 'approved', 'created_at' => '2025-01-05'],
            ['product_id' => 6, 'user_id' => 2, 'rating' => 5, 'comment' => 'Cá hồi tươi ngon, thịt cam đẹp mắt. Làm sashimi tuyệt vời!', 'status' => 'approved', 'created_at' => '2024-12-22'],
            ['product_id' => 10, 'user_id' => 3, 'rating' => 5, 'comment' => 'Cua gạch đầy, thịt chắc. Đúng như mô tả, rất hài lòng.', 'status' => 'approved', 'created_at' => '2025-01-25'],
            ['product_id' => 16, 'user_id' => 4, 'rating' => 5, 'comment' => 'Sò điệp Hokkaido cực phẩm! Nướng bơ tỏi ngon không thể cưỡng lại.', 'status' => 'approved', 'created_at' => '2025-02-10'],
            ['product_id' => 17, 'user_id' => 2, 'rating' => 4, 'comment' => 'Ốc hương tươi, ngọt thịt. Giá hơi cao nhưng xứng đáng.', 'status' => 'approved', 'created_at' => '2025-01-15'],
            ['product_id' => 3, 'user_id' => 5, 'rating' => 5, 'comment' => 'Tôm hùm bông sống khỏe, giao đúng size. Hấp xong thịt cực ngọt!', 'status' => 'approved', 'created_at' => '2025-03-05'],
            ['product_id' => 12, 'user_id' => 4, 'rating' => 5, 'comment' => 'Cua hoàng đế đúng king size! Thịt rất nhiều, cả nhà ăn no nê.', 'status' => 'approved', 'created_at' => '2025-02-20'],
            ['product_id' => 22, 'user_id' => 3, 'rating' => 4, 'comment' => 'Cá hồi sashimi tươi, cắt lát đẹp. Đóng gói hút chân không tốt.', 'status' => 'approved', 'created_at' => '2025-01-10'],
            ['product_id' => 8, 'user_id' => 5, 'rating' => 3, 'comment' => 'Cá ngon nhưng giao hơi chậm, phải đợi 1 ngày.', 'status' => 'hidden', 'created_at' => '2025-03-15'],
        ];

        foreach ($reviews as $review) {
            Review::create($review);
        }
    }
}
