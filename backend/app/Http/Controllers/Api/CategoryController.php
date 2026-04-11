<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')->get();

        return response()->json(['success' => true, 'categories' => $categories]);
    }

public function show($slug)
{
    $category = Category::where('slug', $slug)->firstOrFail();

    $products = Product::with('images')
        ->where('category_id', $category->id)
        ->get();

    return response()->json([
        'success' => true,
        'category' => $category,
        'products' => $products
    ]);
}

    // Admin methods
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:active,inactive',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('image')) {
            $request->validate(['image' => 'image|mimes:jpeg,png,jpg,webp|max:2048']);
            $file = $request->file('image');
            $filename = 'cat_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/categories'), $filename);
            $validated['image'] = 'uploads/categories/' . $filename;
        }

        $category = Category::create($validated);

        return response()->json(['success' => true, 'category' => $category], 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:active,inactive',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('image')) {
            $request->validate(['image' => 'image|mimes:jpeg,png,jpg,webp|max:2048']);
            if ($category->image && file_exists(public_path($category->image))) {
                unlink(public_path($category->image));
            }
            $file = $request->file('image');
            $filename = 'cat_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/categories'), $filename);
            $validated['image'] = 'uploads/categories/' . $filename;
        }

        $category->update($validated);

        return response()->json(['success' => true, 'category' => $category->fresh()]);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        if ($category->image && file_exists(public_path($category->image))) {
            unlink(public_path($category->image));
        }

        $category->delete();

        return response()->json(['success' => true, 'message' => 'Đã xóa danh mục']);
    }
}
