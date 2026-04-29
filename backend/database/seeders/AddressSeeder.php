<?php

namespace Database\Seeders;

use App\Models\Address;
use Illuminate\Database\Seeder;

class AddressSeeder extends Seeder
{
    public function run(): void
    {
        $addresses = [
            [
                'id' => 1,
                'user_id' => 4,
                'name' => 'Le Minh Hai',
                'phone' => '0973627203',
                'address' => '12 Hoa Nam, Hoa Minh, Lien Chieu, Da Nang',
                'is_default' => 0,
                'created_at' => '2026-04-12 06:01:58',
                'updated_at' => '2026-04-15 03:39:15'
            ],
            [
                'id' => 2,
                'user_id' => 4,
                'name' => 'Le Minh Hai',
                'phone' => '0973627203',
                'address' => 'Tu Chanh, Phong Thai, Tp.Hue',
                'is_default' => 1,
                'created_at' => '2026-04-12 06:06:47',
                'updated_at' => '2026-04-15 03:39:15'
            ],
        ];

        Address::insert($addresses);
    }
}