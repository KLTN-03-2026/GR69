<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $posts = [
            [
                'title' => 'Cách chọn tôm hùm tươi sống chuẩn nhất',
                'slug' => 'cach-chon-tom-hum-tuoi-song-chuan-nhat',
                'content' => "Tôm hùm là loại hải sản cao cấp được nhiều người yêu thích. Để chọn được tôm hùm tươi ngon, bạn cần lưu ý:\n\n1. **Quan sát màu sắc**: Tôm hùm tươi có màu xanh đen hoặc xanh đậm tự nhiên, không bị biến màu.\n2. **Kiểm tra độ linh hoạt**: Tôm hùm sống phải còn bơi, càng và đuôi cử động mạnh.\n3. **Ngửi mùi**: Tôm tươi có mùi tanh nhẹ đặc trưng của biển, không có mùi hôi.\n4. **Kiểm tra vỏ**: Vỏ tôm phải cứng, bóng, không bị mềm hay có đốm đen.\n5. **Chọn size phù hợp**: Tôm hùm 500g-1kg là size lý tưởng, đủ thịt và giá hợp lý.",
                'author' => 'ObeSeaFood', 'status' => 'published', 'created_at' => '2025-01-10',
            ],
            [
                'title' => '5 công thức chế biến cua biển ngon nhất tại nhà',
                'slug' => '5-cong-thuc-che-bien-cua-bien-ngon-nhat-tai-nha',
                'content' => "Cua biển là nguyên liệu quen thuộc trong bữa ăn gia đình. Dưới đây là 5 công thức đơn giản:\n\n1. **Cua hấp bia**: Hấp cua với bia và sả, chấm muối tiêu chanh.\n2. **Cua rang me**: Sốt me chua ngọt đậm đà, ăn với cơm nóng.\n3. **Cua nướng muối ớt**: Nướng than hoa với muối ớt xanh.\n4. **Lẩu cua biển**: Nấu lẩu với rau muống, bắp chuối.\n5. **Cua sốt Singapore**: Sốt ớt cay ngọt kiểu Singapore nổi tiếng.",
                'author' => 'ObeSeaFood', 'status' => 'published', 'created_at' => '2025-02-05',
            ],
            [
                'title' => 'Hải sản và sức khỏe: Lợi ích dinh dưỡng bạn cần biết',
                'slug' => 'hai-san-va-suc-khoe-loi-ich-dinh-duong',
                'content' => "Hải sản là nguồn thực phẩm giàu dinh dưỡng với nhiều lợi ích cho sức khỏe:\n\n- **Omega-3**: Cá hồi, cá ngừ giàu omega-3, tốt cho tim mạch và não bộ.\n- **Protein chất lượng cao**: Hải sản cung cấp protein dễ hấp thụ.\n- **Kẽm**: Hàu là nguồn kẽm tốt nhất, hỗ trợ hệ miễn dịch.\n- **Iốt**: Tôm, cua giàu iốt, cần thiết cho tuyến giáp.\n- **Vitamin D**: Cá béo cung cấp vitamin D tự nhiên.\n\nChuyên gia khuyên ăn hải sản 2-3 lần/tuần để đảm bảo dinh dưỡng.",
                'author' => 'ObeSeaFood', 'status' => 'published', 'created_at' => '2025-02-20',
            ],
            [
                'title' => 'Bí quyết bảo quản hải sản tươi lâu trong tủ lạnh',
                'slug' => 'bi-quyet-bao-quan-hai-san-tuoi-lau',
                'content' => "Bảo quản hải sản đúng cách giúp giữ độ tươi ngon lâu hơn:\n\n1. **Rửa sạch** trước khi bảo quản, loại bỏ nội tạng.\n2. **Dùng đá vảy** phủ lên hải sản nếu dùng trong ngày.\n3. **Hút chân không** nếu muốn bảo quản dài ngày.\n4. **Nhiệt độ**: Ngăn mát (0-4°C) dùng trong 1-2 ngày, ngăn đông (-18°C) dùng trong 1-3 tháng.\n5. **Không rã đông rồi đông lại** vì sẽ mất chất và sinh vi khuẩn.",
                'author' => 'ObeSeaFood', 'status' => 'published', 'created_at' => '2025-03-10',
            ],
            [
                'title' => 'Top 10 món hải sản nướng cho buổi tiệc BBQ hoàn hảo',
                'slug' => 'top-10-mon-hai-san-nuong-cho-bbq',
                'content' => "BBQ hải sản luôn là lựa chọn hàng đầu cho các buổi tiệc ngoài trời:\n\n1. Tôm hùm nướng bơ tỏi\n2. Sò điệp nướng phô mai\n3. Mực lá nướng sa tế\n4. Hàu nướng mỡ hành\n5. Cua nướng muối ớt\n6. Tôm sú nướng muối\n7. Bạch tuộc nướng tiêu xanh\n8. Cá hồi nướng chanh dây\n9. Ốc hương nướng tiêu\n10. Set hải sản tổng hợp\n\nMẹo: Ướp hải sản ít nhất 30 phút trước khi nướng để thấm gia vị.",
                'author' => 'ObeSeaFood', 'status' => 'published', 'created_at' => '2025-03-25',
            ],
        ];

        foreach ($posts as $post) {
            Post::create($post);
        }
    }
}
