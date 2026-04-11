<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Tôm', 'slug' => 'tom', 'description' => 'Các loại tôm tươi sống và đông lạnh chất lượng cao', 'image' => '🦐', 'status' => 'active'],
            ['name' => 'Cá', 'slug' => 'ca', 'description' => 'Cá biển tươi ngon, đa dạng chủng loại', 'image' => '🐟', 'status' => 'active'],
            ['name' => 'Cua - Ghẹ', 'slug' => 'cua-ghe', 'description' => 'Cua, ghẹ tươi sống, thịt chắc ngọt tự nhiên', 'image' => '🦀', 'status' => 'active'],
            ['name' => 'Mực - Bạch tuộc', 'slug' => 'muc-bach-tuoc', 'description' => 'Mực, bạch tuộc tươi ngon từ biển', 'image' => '🦑', 'status' => 'active'],
            ['name' => 'Sò - Ốc - Nghêu', 'slug' => 'so-oc-ngheu', 'description' => 'Các loại sò, ốc, nghêu tươi sống', 'image' => '🐚', 'status' => 'active'],
            ['name' => 'Hàu - Bào ngư', 'slug' => 'hau-bao-ngu', 'description' => 'Hàu, bào ngư cao cấp, giàu dinh dưỡng', 'image' => '🦪', 'status' => 'active'],
            ['name' => 'Tôm hùm - Hải sản cao cấp', 'slug' => 'tom-hum-cao-cap', 'description' => 'Tôm hùm và các loại hải sản nhập khẩu cao cấp', 'image' => '🦞', 'status' => 'active'],
            ['name' => 'Hải sản khô', 'slug' => 'hai-san-kho', 'description' => 'Hải sản khô, chế biến sẵn, tiện lợi', 'image' => '🐡', 'status' => 'active'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
