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
                'id' => 2,
                'name' => 'Admin123',
                'email' => 'leminhhai4@gmail.com',
                'phone' => '0973627203',
                'role' => 'admin',
                'gender' => 'male',
                'birthday' => '2004-04-16',
                'avatar' => 'uploads/avatars/avatar_2_1775642657.jpg',
                'email_verified_at' => null,
                'password' => '$2y$12$s3I36czFXGic6uWFqA6sWeqr0mu4Pcg/Cb379U8k03tj3Ek366kg2', //mk: admin12345
                'remember_token' => null,
                'created_at' => '2026-04-07 13:57:46',
                'updated_at' => '2026-04-08 10:20:23'
            ],
        ];
        User::insert($users);
    }
}