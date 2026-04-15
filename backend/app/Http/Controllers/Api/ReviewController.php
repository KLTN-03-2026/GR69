<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function productReviews($productId)
    {
        $reviews = Review::with('user:id,name,avatar')
            ->where('product_id', $productId)
            ->where('status', 'approved')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['success' => true, 'reviews' => $reviews]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();

        $order = $user->orders()
        ->where('id', $validated['order_id'])
        ->where('status', 'delivered')
        ->first();
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Đơn hàng không hợp lệ hoặc chưa hoàn thành',
            ], 403);
        }

        $hasProduct = $order->items()
        ->where('product_id', $validated['product_id'])
        ->exists();
        
        if (!$hasProduct) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm không thuộc đơn hàng này',
            ], 403);
        }

        // Check if user already reviewed this product
        $existing = Review::where('user_id', $user->id)
            ->where('product_id', $validated['product_id'])
            ->where('order_id', $validated['order_id'])
            ->exists();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn đã đánh giá sản phẩm trong đơn này rồi',
            ], 422);
        }

        $review = Review::create([
            'product_id' => $validated['product_id'],
            'user_id' => $user->id,
            'order_id' => $validated['order_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
            'status' => 'approved', // Auto-approve for now
        ]);

        // Update product rating
        $product = Product::find($validated['product_id']);
        if ($product) {
            $product->updateRating();
        }

        return response()->json([
            'success' => true,
            'review' => $review->load('user:id,name,avatar'),
        ], 201);
    }

    // Admin methods
    public function adminIndex(Request $request)
    {
        $query = Review::with(['user:id,name,email', 'product:id,name']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $reviews = $query->orderByDesc('created_at')->paginate(20);

        return response()->json(['success' => true, 'reviews' => $reviews]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,hidden',
        ]);

        $review = Review::findOrFail($id);
        $review->update(['status' => $validated['status']]);

        // Update product rating
        $review->product->updateRating();

        return response()->json(['success' => true, 'review' => $review->load(['user', 'product'])]);
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $productId = $review->product_id;
        $review->delete();

        // Update product rating
        Product::find($productId)?->updateRating();

        return response()->json(['success' => true, 'message' => 'Đã xóa đánh giá']);
    }
}
