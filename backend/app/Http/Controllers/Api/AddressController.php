<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        $addresses = $request->user()->addresses()->orderByDesc('is_default')->get();

        return response()->json(['success' => true, 'addresses' => $addresses]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'is_default' => 'boolean',
        ]);

        $user = $request->user();

        // If this is the first address or set as default, handle default flag
        if ($user->addresses()->count() === 0 || ($validated['is_default'] ?? false)) {
            $user->addresses()->update(['is_default' => false]);
            $validated['is_default'] = true;
        }

        $address = $user->addresses()->create($validated);

        return response()->json(['success' => true, 'address' => $address], 201);
    }

    public function update(Request $request, $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string',
        ]);

        $address->update($validated);

        return response()->json(['success' => true, 'address' => $address]);
    }

    public function destroy(Request $request, $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);
        $wasDefault = $address->is_default;
        $address->delete();

        // If deleted address was default, make the first remaining as default
        if ($wasDefault) {
            $first = $request->user()->addresses()->first();
            if ($first) {
                $first->update(['is_default' => true]);
            }
        }

        return response()->json(['success' => true, 'message' => 'Đã xóa địa chỉ']);
    }

    public function setDefault(Request $request, $id)
    {
        $user = $request->user();
        $address = $user->addresses()->findOrFail($id);

        $user->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return response()->json(['success' => true, 'message' => 'Đã đặt làm địa chỉ mặc định']);
    }
}
