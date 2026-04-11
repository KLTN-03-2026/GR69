<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $wishlist = $request->user()->wishlists()
            ->with('product.images')
            ->get()
            ->pluck('product');

        return response()->json(['success' => true, 'wishlist' => $wishlist]);
    }

    public function toggle(Request $request, $productId)
    {
        $user = $request->user();

        $existing = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'success' => true,
                'action' => 'removed',
                'message' => 'Đã xóa khỏi danh sách yêu thích',
            ]);
        }

        Wishlist::create([
            'user_id' => $user->id,
            'product_id' => $productId,
        ]);

        return response()->json([
            'success' => true,
            'action' => 'added',
            'message' => 'Đã thêm vào danh sách yêu thích',
        ]);
    }
}
