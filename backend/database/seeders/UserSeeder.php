<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin ObeSeaFood',
                'email' => 'admin@haisan.vn',
                'phone' => '0901234567',
                'password' => 'admin123',
                'role' => 'admin',
                'gender' => 'male',
                'birthday' => '1990-01-15',
            ],
            [
                'name' => 'Nguyễn Văn An',
                'email' => 'user@haisan.vn',
                'phone' => '0912345678',
                'password' => 'user123',
                'role' => 'user',
                'gender' => 'male',
                'birthday' => '1995-06-20',
            ],
            [
                'name' => 'Trần Thị Bích',
                'email' => 'bich@gmail.com',
                'phone' => '0987654321',
                'password' => 'bich123',
                'role' => 'user',
                'gender' => 'female',
                'birthday' => '1998-11-08',
            ],
            [
                'name' => 'Lê Hoàng Nam',
                'email' => 'nam@gmail.com',
                'phone' => '0976543210',
                'password' => 'nam123',
                'role' => 'user',
                'gender' => 'male',
                'birthday' => '1992-03-25',
            ],
            [
                'name' => 'Phạm Minh Tú',
                'email' => 'tu@gmail.com',
                'phone' => '0965432109',
                'password' => 'tu123',
                'role' => 'user',
                'gender' => 'female',
                'birthday' => '2000-09-12',
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }
    }
}
