<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'id' => 2, 'category_id' => 1, 'name' => 'Tôm hùm Alaska', 'slug' => 'tom-hum-alaska', 
                'price' => 1500000, 'original_price' => 2000000, 'description' => 'Tôm hùm alaska tươi sống, nhập khẩu trực tiếp.', 
                'origin' => 'Na uy', 'weight' => 1, 'unit' => 'con', 'type' => 'fresh', 
                'is_best_seller' => 1, 'is_new' => 0, 'stock' => 299, 'rating' => 5.0, 
                'created_at' => '2026-04-09 11:48:03', 'updated_at' => '2026-04-29 04:47:59'
            ],
            [
                'id' => 3, 'category_id' => 2, 'name' => 'Ốc hương cồ sống', 'slug' => 'oc-huong-song', 
                'price' => 219000, 'original_price' => 230000, 'description' => 'Ốc Hương Cồ Sống tươi ngon, thịt giòn ngọt.', 
                'origin' => 'Khánh Hòa - Việt Nam', 'weight' => 1, 'unit' => 'kg', 'type' => 'fresh', 
                'is_best_seller' => 1, 'is_new' => 0, 'stock' => 50, 'rating' => 0.0, 
                'created_at' => '2026-04-09 12:59:18', 'updated_at' => '2026-04-09 13:55:18'
            ],
            [
                'id' => 7, 'category_id' => 4, 'name' => 'Thăn cá hồi phi lê tươi', 'slug' => 'than-ca-hoi-phi-le-tuoi', 
                'price' => 199000, 'original_price' => 220000, 'description' => 'Tươi, xẻ mới mỗi ngày, chuẩn ăn sashimi.', 
                'origin' => 'Na uy', 'weight' => 200, 'unit' => 'gr', 'type' => 'fresh', 
                'is_best_seller' => 1, 'is_new' => 0, 'stock' => 18, 'rating' => 5.0, 
                'created_at' => '2026-04-10 02:31:07', 'updated_at' => '2026-04-15 02:39:10'
            ],
            [
                'id' => 8, 'category_id' => 4, 'name' => 'Chân cua hoàng đế', 'slug' => 'chan-cua-hoang-de', 
                'price' => 2190000, 'original_price' => 2250000, 'description' => 'Đã luộc chín, Đông lạnh bảo quản chuẩn.', 
                'origin' => 'Nga', 'weight' => 2, 'unit' => 'kg', 'type' => 'frozen', 
                'is_best_seller' => 1, 'is_new' => 0, 'stock' => 8, 'rating' => 5.0, 
                'created_at' => '2026-04-10 02:42:40', 'updated_at' => '2026-04-29 04:47:48'
            ],
            [
                'id' => 9, 'category_id' => 1, 'name' => 'Ốc nhảy indonesia', 'slug' => 'oc-nhay-indonesia', 
                'price' => 149000, 'original_price' => 180000, 'description' => 'Ốc nhảy Indo đông lạnh chất lượng.', 
                'origin' => 'Indonesia', 'weight' => 1, 'unit' => 'kg', 'type' => 'frozen', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 50, 'rating' => 0.0, 
                'created_at' => '2026-04-10 03:21:42', 'updated_at' => '2026-04-10 03:21:42'
            ],
            [
                'id' => 10, 'category_id' => 1, 'name' => 'Ốc hương indonesia', 'slug' => 'oc-huong-indonesia', 
                'price' => 199000, 'original_price' => 220000, 'description' => 'Ốc hương Indo đông lạnh, thơm ngon.', 
                'origin' => 'Indonesia', 'weight' => 1, 'unit' => 'kg', 'type' => 'frozen', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 50, 'rating' => 0.0, 
                'created_at' => '2026-04-10 03:25:12', 'updated_at' => '2026-04-10 03:25:12'
            ],
            [
                'id' => 11, 'category_id' => 2, 'name' => 'Tôm thẻ tươi', 'slug' => 'tom-the-tuoi', 
                'price' => 49000, 'original_price' => 58000, 'description' => 'Tôm thẻ tươi sống bắt tại đầm.', 
                'origin' => 'Bến Tre - Việt Nam', 'weight' => 200, 'unit' => 'gr', 'type' => 'fresh', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 1998, 'rating' => 0.0, 
                'created_at' => '2026-04-10 03:28:45', 'updated_at' => '2026-04-25 07:29:08'
            ],
            [
                'id' => 15, 'category_id' => 11, 'name' => 'Ốc nhảy indonesia', 'slug' => 'oc-nhay-indonesia-1', 
                'price' => 149000, 'original_price' => 169000, 'description' => 'Ốc nhảy Indo đánh bắt tươi.', 
                'origin' => 'Indonesia', 'weight' => 1, 'unit' => 'kg', 'type' => 'fresh', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 46, 'rating' => 0.0, 
                'created_at' => '2026-04-10 03:44:32', 'updated_at' => '2026-04-19 01:37:51'
            ],
            [
                'id' => 16, 'category_id' => 11, 'name' => 'Sò điệp nhật', 'slug' => 'so-diep-nhat', 
                'price' => 225000, 'original_price' => 249000, 'description' => 'Được mệnh danh là loại cồi sò ngon nhất.', 
                'origin' => 'Hokkaido - Nhật Bản', 'weight' => 1, 'unit' => 'kg', 'type' => 'frozen', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 24, 'rating' => 0.0, 
                'created_at' => '2026-04-10 03:48:41', 'updated_at' => '2026-04-19 01:37:51'
            ],
            [
                'id' => 17, 'category_id' => 5, 'name' => 'Cá hồi cắt khoanh', 'slug' => 'ca-hoi-cat-khoanh', 
                'price' => 259000, 'original_price' => 279000, 'description' => 'Trong giới ẩm thực, cá hồi rất được ưa chuộng.', 
                'origin' => 'Chile', 'weight' => 500, 'unit' => 'gr', 'type' => 'fresh', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 2998, 'rating' => 5.0, 
                'created_at' => '2026-04-10 03:52:02', 'updated_at' => '2026-04-25 07:28:54'
            ],
            [
                'id' => 18, 'category_id' => 5, 'name' => 'Đuôi cá hồi file tươi', 'slug' => 'duoi-ca-hoi-file-tuoi', 
                'price' => 99000, 'original_price' => 110000, 'description' => 'Trong giới ẩm thực rất nổi tiếng.', 
                'origin' => 'Na uy', 'weight' => 200, 'unit' => 'kg', 'type' => 'fresh', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 3000, 'rating' => 0.0, 
                'created_at' => '2026-04-10 03:56:01', 'updated_at' => '2026-04-10 03:56:01'
            ],
            [
                'id' => 19, 'category_id' => 7, 'name' => 'Bào ngư hàn quốc', 'slug' => 'bao-ngu-han-quoc', 
                'price' => 69000, 'original_price' => 101000, 'description' => 'Bào ngư là một loại hải sản quý hiếm.', 
                'origin' => 'Hàn Quốc', 'weight' => 1, 'unit' => 'con', 'type' => 'fresh', 
                'is_best_seller' => 1, 'is_new' => 0, 'stock' => 199, 'rating' => 0.0, 
                'created_at' => '2026-04-10 11:27:21', 'updated_at' => '2026-04-16 10:04:11'
            ],
            [
                'id' => 20, 'category_id' => 9, 'name' => 'Tôm hùm bông sống', 'slug' => 'tom-hum-bong-song', 
                'price' => 990000, 'original_price' => 1100000, 'description' => 'Tôm hùm bông sống khỏe, thịt chắc.', 
                'origin' => 'Khánh Hòa - Việt Nam', 'weight' => 500, 'unit' => 'gr/con', 'type' => 'fresh', 
                'is_best_seller' => 1, 'is_new' => 0, 'stock' => 98, 'rating' => 0.0, 
                'created_at' => '2026-04-10 11:32:55', 'updated_at' => '2026-04-25 07:28:21'
            ],
            [
                'id' => 21, 'category_id' => 10, 'name' => 'Mực lá size lớn', 'slug' => 'muc-la-size-lon', 
                'price' => 239000, 'original_price' => 259000, 'description' => 'Mực lá có tên khoa học là...', 
                'origin' => 'PHILIPPINES hoặc VIỆT NAM', 'weight' => 500, 'unit' => 'gr/con', 'type' => 'fresh', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 100, 'rating' => 0.0, 
                'created_at' => '2026-04-10 11:36:40', 'updated_at' => '2026-04-25 07:28:05'
            ],
            [
                'id' => 22, 'category_id' => 8, 'name' => 'Cua Thịt Cà Mau', 'slug' => 'cua-thit-ca-mau', 
                'price' => 236000, 'original_price' => 250000, 'description' => 'Cua Thịt Cà Mau lừng danh thơm ngon.', 
                'origin' => 'Cà Mau - Việt Nam', 'weight' => 1, 'unit' => 'con', 'type' => 'fresh', 
                'is_best_seller' => 1, 'is_new' => 0, 'stock' => 48, 'rating' => 4.0, 
                'created_at' => '2026-04-10 11:41:27', 'updated_at' => '2026-04-15 03:58:17'
            ],
            [
                'id' => 23, 'category_id' => 5, 'name' => 'Cá Hồi Nguyên Con Tươi', 'slug' => 'ca-hoi-nguyen-con-tuoi', 
                'price' => 3894000, 'original_price' => 4125000, 'description' => 'Cá hồi Nauy là loại cá chất lượng cao.', 
                'origin' => 'Nauy', 'weight' => 6, 'unit' => 'kg/con', 'type' => 'fresh', 
                'is_best_seller' => 0, 'is_new' => 1, 'stock' => 20, 'rating' => 0.0, 
                'created_at' => '2026-04-25 07:11:08', 'updated_at' => '2026-04-25 07:26:36'
            ],
            [
                'id' => 24, 'category_id' => 5, 'name' => 'Lườn Cá Hồi Tươi', 'slug' => 'luon-ca-hoi-tuoi', 
                'price' => 45000, 'original_price' => 55000, 'description' => 'Lườn Cá Hồi Na Uy béo ngậy.', 
                'origin' => 'Nauy', 'weight' => 200, 'unit' => 'g/khay', 'type' => 'frozen', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 60, 'rating' => 0.0, 
                'created_at' => '2026-04-25 07:15:03', 'updated_at' => '2026-04-25 07:26:22'
            ],
            [
                'id' => 25, 'category_id' => 5, 'name' => 'Cá Hồi Xông Khói Vị Truyền Thống', 'slug' => 'ca-hoi-xong-khoi-vi-truyen-thong', 
                'price' => 295000, 'original_price' => 314998, 'description' => 'Cá Hồi Xông Khói đậm vị truyền thống.', 
                'origin' => 'Việt Nam', 'weight' => 200, 'unit' => 'g/hộp', 'type' => 'dried', 
                'is_best_seller' => 0, 'is_new' => 1, 'stock' => 20, 'rating' => 0.0, 
                'created_at' => '2026-04-25 07:46:54', 'updated_at' => '2026-04-25 07:46:54'
            ],
            [
                'id' => 26, 'category_id' => 5, 'name' => 'Đầu Cá Hồi Tươi', 'slug' => 'dau-ca-hoi-tuoi', 
                'price' => 60000, 'original_price' => 64999, 'description' => 'Đầu cá hồi tươi ngon để nấu lẩu.', 
                'origin' => 'Na uy', 'weight' => 548, 'unit' => 'g/cái', 'type' => 'fresh', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 50, 'rating' => 0.0, 
                'created_at' => '2026-04-25 07:50:13', 'updated_at' => '2026-04-25 07:50:13'
            ],
            [
                'id' => 27, 'category_id' => 5, 'name' => 'Trứng Cá Hồi', 'slug' => 'trung-ca-hoi', 
                'price' => 190000, 'original_price' => 210000, 'description' => 'Trứng cá hồi là thực phẩm bổ dưỡng.', 
                'origin' => 'Na uy', 'weight' => 50, 'unit' => 'g/hủ', 'type' => 'fresh', 
                'is_best_seller' => 0, 'is_new' => 1, 'stock' => 20, 'rating' => 0.0, 
                'created_at' => '2026-04-25 07:53:06', 'updated_at' => '2026-04-25 07:53:06'
            ],
            [
                'id' => 28, 'category_id' => 5, 'name' => 'Cá Hồi Phi Lê Tươi Nguyên Miếng', 'slug' => 'ca-hoi-phi-le-tuoi-nguyen-mieng', 
                'price' => 1999000, 'original_price' => 2125000, 'description' => 'Cá hồi có ở nhiều nhà hàng sang trọng.', 
                'origin' => 'Na uy', 'weight' => 2.2, 'unit' => 'kg/miếng', 'type' => 'fresh', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 20, 'rating' => 0.0, 
                'created_at' => '2026-04-25 07:59:23', 'updated_at' => '2026-04-25 07:59:23'
            ],
            [
                'id' => 29, 'category_id' => 10, 'name' => 'Mực Sữa', 'slug' => 'muc-sua', 
                'price' => 129000, 'original_price' => 135000, 'description' => 'Mực sữa (mực cơm) tươi ngọt.', 
                'origin' => 'Phan Thiết, Việt Nam', 'weight' => 500, 'unit' => 'g/khay', 'type' => 'frozen', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 20, 'rating' => 0.0, 
                'created_at' => '2026-04-25 08:04:43', 'updated_at' => '2026-04-25 08:04:43'
            ],
            [
                'id' => 30, 'category_id' => 10, 'name' => 'Mực Ống Size S', 'slug' => 'muc-ong-size-s', 
                'price' => 239000, 'original_price' => 249000, 'description' => 'Mực ống là một món ăn phổ biến.', 
                'origin' => 'Bình Thuận, Việt Nam', 'weight' => 500, 'unit' => 'g/khay', 'type' => 'fresh', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 30, 'rating' => 0.0, 
                'created_at' => '2026-04-25 08:18:16', 'updated_at' => '2026-04-25 08:18:16'
            ],
            [
                'id' => 31, 'category_id' => 10, 'name' => 'Mực Ống Size L', 'slug' => 'muc-ong-size-l', 
                'price' => 259000, 'original_price' => 269000, 'description' => 'Mực ống đồng làm sạch đóng khay.', 
                'origin' => 'Bình Thuận, Việt Nam', 'weight' => 500, 'unit' => 'g/khay', 'type' => 'fresh', 
                'is_best_seller' => 1, 'is_new' => 0, 'stock' => 30, 'rating' => 0.0, 
                'created_at' => '2026-04-25 08:19:42', 'updated_at' => '2026-04-25 08:19:42'
            ],
            [
                'id' => 32, 'category_id' => 10, 'name' => 'Mực Ống 1 Nắng', 'slug' => 'muc-ong-1-nang', 
                'price' => 329000, 'original_price' => 349000, 'description' => 'Mực ống 1 nắng dẻo thơm.', 
                'origin' => 'Việt Nam', 'weight' => 500, 'unit' => 'g/Túi', 'type' => 'fresh', 
                'is_best_seller' => 1, 'is_new' => 0, 'stock' => 30, 'rating' => 0.0, 
                'created_at' => '2026-04-25 08:23:10', 'updated_at' => '2026-04-25 08:23:10'
            ],
            [
                'id' => 33, 'category_id' => 10, 'name' => 'Mực Ống Trứng', 'slug' => 'muc-ong-trung', 
                'price' => 289000, 'original_price' => 319000, 'description' => 'Mực ống trứng lấp đầy dinh dưỡng.', 
                'origin' => 'Bình Thuận, Việt Nam', 'weight' => 500, 'unit' => 'g/khay', 'type' => 'fresh', 
                'is_best_seller' => 0, 'is_new' => 1, 'stock' => 30, 'rating' => 0.0, 
                'created_at' => '2026-04-25 08:25:22', 'updated_at' => '2026-04-25 08:25:22'
            ],
            [
                'id' => 34, 'category_id' => 10, 'name' => 'Bạch Tuộc', 'slug' => 'bach-tuoc', 
                'price' => 165000, 'original_price' => 175000, 'description' => 'Bạch Tuộc Tươi Sống giòn dai.', 
                'origin' => 'Việt Nam', 'weight' => 500, 'unit' => 'g/khay', 'type' => 'fresh', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 30, 'rating' => 0.0, 
                'created_at' => '2026-04-25 08:27:32', 'updated_at' => '2026-04-25 08:27:32'
            ],
            [
                'id' => 35, 'category_id' => 8, 'name' => 'Chân Cua Tuyết', 'slug' => 'chan-cua-tuyet', 
                'price' => 720000, 'original_price' => 750000, 'description' => 'Với hình dáng thon dài, thịt ngọt lịm.', 
                'origin' => 'Nga', 'weight' => 1, 'unit' => 'kg/Túi', 'type' => 'fresh', 
                'is_best_seller' => 1, 'is_new' => 0, 'stock' => 20, 'rating' => 0.0, 
                'created_at' => '2026-04-25 08:36:36', 'updated_at' => '2026-04-25 08:36:36'
            ],
            [
                'id' => 36, 'category_id' => 8, 'name' => 'Ghẹ Xanh Sống 5-7 Con/kg', 'slug' => 'ghe-xanh-song-5-7-conkg', 
                'price' => 739000, 'original_price' => 769000, 'description' => 'Ghẹ xanh của Đảo Ngọc Phú Quốc.', 
                'origin' => 'Phan Thiết - Việt Nam', 'weight' => 1, 'unit' => 'kg', 'type' => 'fresh', 
                'is_best_seller' => 1, 'is_new' => 0, 'stock' => 20, 'rating' => 0.0, 
                'created_at' => '2026-04-25 08:40:01', 'updated_at' => '2026-04-25 08:40:01'
            ],
            [
                'id' => 37, 'category_id' => 8, 'name' => 'Cua Gạch Cà Mau Size 300 - 400g', 'slug' => 'cua-gach-ca-mau-size-300-400g', 
                'price' => 379000, 'original_price' => 399000, 'description' => 'Cua Gạch Cà Mau gạch son đỏ au.', 
                'origin' => 'Cà Mau - Việt Nam', 'weight' => 1, 'unit' => 'con', 'type' => 'fresh', 
                'is_best_seller' => 1, 'is_new' => 0, 'stock' => 30, 'rating' => 0.0, 
                'created_at' => '2026-04-25 08:41:51', 'updated_at' => '2026-04-25 08:41:51'
            ],
            [
                'id' => 38, 'category_id' => 8, 'name' => 'Cua Hoàng Đế Đỏ - King Crab Sống', 'slug' => 'cua-hoang-de-do-king-crab-song', 
                'price' => 5580000, 'original_price' => 6120000, 'description' => 'Cua King Đỏ (King Crab) sống hảo hạng.', 
                'origin' => 'Na uy', 'weight' => 2, 'unit' => 'kg/con', 'type' => 'fresh', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 20, 'rating' => 0.0, 
                'created_at' => '2026-04-25 08:44:15', 'updated_at' => '2026-04-25 08:44:15'
            ],
            [
                'id' => 39, 'category_id' => 9, 'name' => 'Tôm Sú Sống', 'slug' => 'tom-su-song', 
                'price' => 225000, 'original_price' => 244998, 'description' => 'Tôm sú sống là đặc sản biển ngon.', 
                'origin' => 'Bến Tre - Việt Nam', 'weight' => 500, 'unit' => 'g', 'type' => 'fresh', 
                'is_best_seller' => 1, 'is_new' => 0, 'stock' => 30, 'rating' => 0.0, 
                'created_at' => '2026-04-25 08:55:45', 'updated_at' => '2026-04-25 08:55:45'
            ],
            [
                'id' => 40, 'category_id' => 9, 'name' => 'Tôm Sú Biển Size 8-10 Con', 'slug' => 'tom-su-bien-size-8-10-con', 
                'price' => 425000, 'original_price' => 445000, 'description' => 'Tôm sú biển là loại tôm tự nhiên.', 
                'origin' => 'Việt Nam', 'weight' => 500, 'unit' => 'g/khay', 'type' => 'fresh', 
                'is_best_seller' => 1, 'is_new' => 0, 'stock' => 30, 'rating' => 0.0, 
                'created_at' => '2026-04-25 08:58:00', 'updated_at' => '2026-04-25 08:58:00'
            ],
            [
                'id' => 41, 'category_id' => 9, 'name' => 'Tôm Hùm Xanh Sống', 'slug' => 'tom-hum-xanh-song', 
                'price' => 535000, 'original_price' => 555000, 'description' => 'Tôm hùm xanh sống khỏe mạnh.', 
                'origin' => 'Việt Nam', 'weight' => 350, 'unit' => 'g/con', 'type' => 'fresh', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 30, 'rating' => 0.0, 
                'created_at' => '2026-04-25 08:59:30', 'updated_at' => '2026-04-25 08:59:30'
            ],
            [
                'id' => 42, 'category_id' => 9, 'name' => 'Tôm thẻ tươi', 'slug' => 'tom-the-tuoi-1', 
                'price' => 49000, 'original_price' => 58000, 'description' => 'Tôm thẻ tươi sống làm sạch.', 
                'origin' => 'Bến Tre - Việt Nam', 'weight' => 200, 'unit' => 'g/khay', 'type' => 'fresh', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 20, 'rating' => 0.0, 
                'created_at' => '2026-04-25 09:01:12', 'updated_at' => '2026-04-25 09:01:12'
            ],
            [
                'id' => 43, 'category_id' => 7, 'name' => 'Ngao Bác Mỹ', 'slug' => 'ngao-bac-my', 
                'price' => 129000, 'original_price' => 139000, 'description' => 'Ngao có kích thước lớn, thịt dày.', 
                'origin' => 'Vân Đồn - Việt Nam', 'weight' => 0, 'unit' => 'kg', 'type' => 'fresh', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 30, 'rating' => 0.0, 
                'created_at' => '2026-04-25 09:10:06', 'updated_at' => '2026-04-25 09:10:06'
            ],
            [
                'id' => 44, 'category_id' => 7, 'name' => 'Nghêu Trắng Sống ( Ngao )', 'slug' => 'ngheu-trang-song-ngao', 
                'price' => 89000, 'original_price' => 99000, 'description' => 'Nghêu hay còn gọi là ngao trắng.', 
                'origin' => 'Tiền Giang - Việt Nam.', 'weight' => 1, 'unit' => 'kg', 'type' => 'fresh', 
                'is_best_seller' => 1, 'is_new' => 0, 'stock' => 20, 'rating' => 0.0, 
                'created_at' => '2026-04-25 09:11:22', 'updated_at' => '2026-04-25 09:11:22'
            ],
            [
                'id' => 45, 'category_id' => 7, 'name' => 'Sò Huyết VN Sống 40-50', 'slug' => 'so-huyet-vn-song-40-50', 
                'price' => 195000, 'original_price' => 215000, 'description' => 'Sò huyết là một món ăn tẩm bổ tốt.', 
                'origin' => 'Cà Mau, Kiên Giang, Tiền Gian...', 'weight' => 500, 'unit' => 'g', 'type' => 'fresh', 
                'is_best_seller' => 1, 'is_new' => 0, 'stock' => 40, 'rating' => 0.0, 
                'created_at' => '2026-04-25 09:12:33', 'updated_at' => '2026-04-25 09:12:33'
            ],
            [
                'id' => 46, 'category_id' => 7, 'name' => 'Ốc Chip Chip - Sò Lụa Sống', 'slug' => 'oc-chip-chip-so-lua-song', 
                'price' => 69000, 'original_price' => 75000, 'description' => 'Ốc Chip Chip sống dai ngon.', 
                'origin' => 'Kiên Giang - Việt Nam.', 'weight' => 1, 'unit' => 'kg', 'type' => 'fresh', 
                'is_best_seller' => 0, 'is_new' => 0, 'stock' => 32, 'rating' => 0.0, 
                'created_at' => '2026-04-25 09:14:05', 'updated_at' => '2026-04-25 09:14:05'
            ]
        ];

        Product::insert($products);
    }
}