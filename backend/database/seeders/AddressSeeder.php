<?php

namespace Database\Seeders;

use App\Models\Address;
use Illuminate\Database\Seeder;

class AddressSeeder extends Seeder
{
    public function run(): void
    {
        $addresses = [
            // Admin
            ['user_id' => 1, 'name' => 'Admin', 'phone' => '0901234567', 'address' => '123 Nguyễn Huệ, Quận 1, TP.HCM', 'is_default' => true],
            // Nguyễn Văn An
            ['user_id' => 2, 'name' => 'Nguyễn Văn An', 'phone' => '0912345678', 'address' => '456 Lê Lợi, Quận 3, TP.HCM', 'is_default' => true],
            ['user_id' => 2, 'name' => 'Nguyễn Văn An', 'phone' => '0912345678', 'address' => '789 Trần Hưng Đạo, Quận 5, TP.HCM', 'is_default' => false],
            // Trần Thị Bích
            ['user_id' => 3, 'name' => 'Trần Thị Bích', 'phone' => '0987654321', 'address' => '12 Hoàng Sa, Quận Tân Bình, TP.HCM', 'is_default' => true],
            // Lê Hoàng Nam
            ['user_id' => 4, 'name' => 'Lê Hoàng Nam', 'phone' => '0976543210', 'address' => '34 Nguyễn Trãi, Quận Hà Đông, Hà Nội', 'is_default' => true],
        ];

        foreach ($addresses as $address) {
            Address::create($address);
        }
    }
}
