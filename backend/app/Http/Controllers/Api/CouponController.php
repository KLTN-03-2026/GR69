<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function apply(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
            'subtotal' => 'required|integer|min:0',
        ]);

        $coupon = Coupon::where('code', strtoupper($validated['code']))->first();

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Mã giảm giá không hợp lệ',
            ], 404);
        }

        if (!$coupon->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'Mã giảm giá đã hết hạn hoặc đã sử dụng hết',
            ], 422);
        }

        if ($validated['subtotal'] < $coupon->min_order) {
            return response()->json([
                'success' => false,
                'message' => "Đơn hàng tối thiểu " . number_format($coupon->min_order) . "đ để sử dụng mã này",
            ], 422);
        }

        $discount = $coupon->calculateDiscount($validated['subtotal']);

        return response()->json([
            'success' => true,
            'coupon' => $coupon->only(['code', 'type', 'value', 'label']),
            'discount' => $discount,
            'message' => $coupon->label,
        ]);
    }

    public function index(Request $request)
    {
        $query = Coupon::query();
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('code', 'like', "%{$search}%")
                  ->orWhere('label', 'like', "%{$search}%");
                  }
        $coupons = $query->orderByDesc('created_at')->paginate(10);

        return response()->json([
            'success' => true,
            'coupons' => $coupons
        ]);
    }
    public function show($id)
{
    $coupon = Coupon::findOrFail($id);

    return response()->json([
        'success' => true,
        'coupon' => $coupon
    ]);
}

    public function store(Request $request)
    {
        $validated = $request->validate([
        'code' => 'required|string|unique:coupons,code',
        'label' => 'required|string',
        'type' => 'required|in:percent,fixed',
        'value' => 'required|numeric|min:0',
        'min_order' => 'nullable|numeric|min:0',
        'max_uses' => 'nullable|integer|min:0',
        'expires_at' => 'nullable|date',
        'is_active' => 'boolean',
    ]);
    
    $coupon = Coupon::create([
        'code' => strtoupper($validated['code']),
        'label' => $validated['label'],
        'type' => $validated['type'],
        'value' => $validated['value'],
        'min_order' => $validated['min_order'] ?? 0,
        'max_uses' => $validated['max_uses'] ?? 0,
        'expires_at' => $validated['expires_at'] ?? null,
        'is_active' => $validated['is_active'] ?? 1,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Tạo voucher thành công',
        'coupon' => $coupon
    ]);
}

public function update(Request $request, $id)
{
    $coupon = Coupon::findOrFail($id);

    $validated = $request->validate([
        'code' => "required|string|unique:coupons,code,{$id}",
        'label' => 'required|string',
        'type' => 'required|in:percent,fixed',
        'value' => 'required|numeric|min:0',
        'min_order' => 'nullable|numeric|min:0',
        'max_uses' => 'nullable|integer|min:0',
        'expires_at' => 'nullable|date',
        'is_active' => 'boolean',
    ]);

    $coupon->update([
        'code' => strtoupper($validated['code']),
        'label' => $validated['label'],
        'type' => $validated['type'],
        'value' => $validated['value'],
        'min_order' => $validated['min_order'] ?? 0,
        'max_uses' => $validated['max_uses'] ?? 0,
        'expires_at' => $validated['expires_at'] ?? null,
        'is_active' => $validated['is_active'] ?? 1,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Cập nhật thành công',
        'coupon' => $coupon
    ]);
}

public function destroy($id)
{
    $coupon = Coupon::findOrFail($id);
    $coupon->delete();

    return response()->json([
        'success' => true,
        'message' => 'Xóa voucher thành công'
    ]);
}
}
