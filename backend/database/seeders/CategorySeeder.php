<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $categories = [
           [
                'id' => 1, 
                'name' => 'Hải sản đông lạnh mới', 
                'slug' => 'hai-san-dong-lanh-moi', 
                'description' => 'Hải sản đông lạnh siêu ngon, giá cả phù hợp với mọi nhà.', 
                'image' => 'uploads/categories/cat_1775663803.jpg', 
                'status' => 'active',
                'created_at' => '2026-04-08 14:17:18',
                'updated_at' => '2026-04-09 07:46:31'
            ],
            [
                'id' => 2, 
                'name' => 'Hải sản tươi sống', 
                'slug' => 'hai-san-tuoi-song', 
                'description' => 'Hải sản tươi sống siêu ngon, giá cả phù hợp.', 
                'image' => 'uploads/categories/cat_1775719947.jpg', 
                'status' => 'active',
                'created_at' => '2026-04-09 07:32:27',
                'updated_at' => '2026-04-09 07:32:27'
            ],
            [
                'id' => 4, 
                'name' => 'Bán chạy nhất', 
                'slug' => 'ban-chay-nhat', 
                'description' => 'Các sản phẩm thơm ngon, bán chạy nhất tại cửa hàng.', 
                'image' => 'uploads/categories/cat_1775786405.jpg', 
                'status' => 'active',
                'created_at' => '2026-04-10 01:58:01',
                'updated_at' => '2026-04-10 02:00:05'
            ],
            [
                'id' => 5, 
                'name' => 'Cá hồi', 
                'slug' => 'ca-hoi', 
                'description' => 'Cá hồi tươi ngon, chuẩn sashimi. Thơm ngon hảo hạng.', 
                'image' => 'uploads/categories/cat_1775786703.png', 
                'status' => 'active',
                'created_at' => '2026-04-10 02:03:33',
                'updated_at' => '2026-04-10 02:05:03'
            ],
            [
                'id' => 6, 
                'name' => 'Hàu sữa Việt Nam va Nhập khẩu', 
                'slug' => 'hau-sua-viet-nam-va-nhap-khau', 
                'description' => 'Thịt Hàu Sữa tươi được nhập mới mỗi ngày tại cửa hàng.', 
                'image' => 'uploads/categories/cat_1775786991.png', 
                'status' => 'active',
                'created_at' => '2026-04-10 02:09:06',
                'updated_at' => '2026-04-10 02:09:51'
            ],
            [
                'id' => 7, 
                'name' => 'Ngao-Sò-Ốc', 
                'slug' => 'ngao-so-oc', 
                'description' => 'Ngao, sò, ốc được nhập trong ngày, đảm bảo tươi ngon.', 
                'image' => 'uploads/categories/cat_1775787429.png', 
                'status' => 'active',
                'created_at' => '2026-04-10 02:17:09',
                'updated_at' => '2026-04-10 02:17:09'
            ],
            [
                'id' => 8, 
                'name' => 'Cua, ghẹ tươi rói', 
                'slug' => 'cua-ghe-tuoi-roi', 
                'description' => 'Cua ghẹ tươi rói, thơm ngon.', 
                'image' => 'uploads/categories/cat_1775787537.png', 
                'status' => 'active',
                'created_at' => '2026-04-10 02:18:57',
                'updated_at' => '2026-04-10 02:18:57'
            ],
            [
                'id' => 9, 
                'name' => 'Các loại tôm ngon', 
                'slug' => 'cac-loai-tom-ngon', 
                'description' => 'Tôm các loại thơm ngon tuyệt vời.', 
                'image' => 'uploads/categories/cat_1775787620.jpg', 
                'status' => 'active',
                'created_at' => '2026-04-10 02:20:20',
                'updated_at' => '2026-04-10 02:20:20'
            ],
            [
                'id' => 10, 
                'name' => 'Mực tươi mỗi ngày', 
                'slug' => 'muc-tuoi-moi-ngay', 
                'description' => 'Mực tươi được nhập về mỗi ngày.', 
                'image' => 'uploads/categories/cat_1775787666.png', 
                'status' => 'active',
                'created_at' => '2026-04-10 02:21:06',
                'updated_at' => '2026-04-10 02:21:06'
            ],
            [
                'id' => 11, 
                'name' => 'Hải sản nhập khẩu', 
                'slug' => 'hai-san-nhap-khau', 
                'description' => 'Hải sản nhập khẩu thơm ngon, chất lượng', 
                'image' => 'uploads/categories/cat_1775787741.png', 
                'status' => 'active',
                'created_at' => '2026-04-10 02:22:21',
                'updated_at' => '2026-04-10 02:22:21'
            ],
        ];
        Category::insert($categories);
    }
}
