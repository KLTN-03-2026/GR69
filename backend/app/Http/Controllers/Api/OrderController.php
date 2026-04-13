<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Coupon;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()->orders()
            ->with('items')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['success' => true, 'orders' => $orders]);
    }

    public function show(Request $request, $id)
    {
        $order = $request->user()->orders()
            ->with('items.product.images')
            ->findOrFail($id);

        return response()->json(['success' => true, 'order' => $order]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_name' => 'required|string|max:255',
            'shipping_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string',
            'payment_method' => 'required|in:cod,banking,ewallet',
            'coupon_code' => 'nullable|string',
            'note' => 'nullable|string',
        ]);

        $user = $request->user();

        // Calculate totals
        $subtotal = 0;
        $orderItems = [];

        foreach ($validated['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);

            if ($product->stock < $item['quantity']) {
                return response()->json([
                    'success' => false,
                    'message' => "Sản phẩm '{$product->name}' chỉ còn {$product->stock} trong kho",
                ], 422);
            }

            $orderItems[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'price' => $product->price,
                'quantity' => $item['quantity'],
            ];

            $subtotal += $product->price * $item['quantity'];
        }

        // Shipping fee: free if over 500k
        $shippingFee = $subtotal >= 500000 ? 0 : 30000;

        // Apply coupon
        $discount = 0;
        $couponCode = $validated['coupon_code'] ?? null;

        if ($couponCode) {
            $coupon = Coupon::where('code', strtoupper($couponCode))->first();
            if ($coupon && $coupon->isValid() && $subtotal >= $coupon->min_order) {
                $discount = $coupon->calculateDiscount($subtotal);
                $coupon->increment('used_count');
            }
        }

        $totalAmount = $subtotal - $discount + $shippingFee;

        // Create order
        $order = Order::create([
            'user_id' => $user->id,
            'total_amount' => $totalAmount,
            'shipping_fee' => $shippingFee,
            'coupon_code' => $couponCode,
            'discount' => $discount,
            'status' => 'pending',
            'shipping_name' => $validated['shipping_name'],
            'shipping_phone' => $validated['shipping_phone'],
            'shipping_address' => $validated['shipping_address'],
            'payment_method' => $validated['payment_method'],
            'note' => $validated['note'] ?? null,
        ]);

        // Create order items and reduce stock
        foreach ($orderItems as $item) {
            $order->items()->create($item);
            Product::where('id', $item['product_id'])->decrement('stock', $item['quantity']);
        }

        return response()->json([
            'success' => true,
            'order' => $order->load('items'),
            'message' => 'Đặt hàng thành công',
        ], 201);
    }

    // Admin methods
    public function adminIndex(Request $request)
    {
        $query = Order::with(['user', 'items']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->orderByDesc('created_at')->paginate(20);

        return response()->json(['success' => true, 'orders' => $orders]);
    }

    public function adminShow($id)
    {
        $order = Order::with([
            'user',
            'items.product.images'
        ])->findOrFail($id);
        return response()->json([
            'success' => true,
            'order' => $order
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipping,delivered,cancelled',
        ]);

        $order = Order::findOrFail($id);

        // If cancelling, restore stock
        if ($validated['status'] === 'cancelled') {
            if ($order->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Chỉ được hủy khi đơn ở trạng thái chờ xử lý'
                ], 422);
            }
            
            foreach ($order->items as $item) {
                Product::where('id', $item->product_id)->increment('stock', $item->quantity);
            }
        }

        $order->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'order' => $order->load(['user', 'items']),
        ]);
    }

    public function cancel($id, Request $request)
    {
    $order = $request->user()->orders()->findOrFail($id);

    if ($order->status !== 'pending') {
        return response()->json([
            'success' => false,
            'message' => 'Chỉ được hủy đơn khi đang chờ xử lý'
        ], 400);
    }

    // restore stock
    foreach ($order->items as $item) {
        Product::where('id', $item->product_id)
            ->increment('stock', $item->quantity);
    }

    $order->update(['status' => 'cancelled']);

    return response()->json([
        'success' => true,
        'message' => 'Đã hủy đơn hàng'
    ]);
}
}
