<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images']);

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->has('category_slug')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category_slug));
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('origin', 'like', "%{$search}%");
            });
        }

        // Best sellers
        if ($request->boolean('best_seller')) {
            $query->where('is_best_seller', true);
        }

        // New products
        if ($request->boolean('is_new')) {
            $query->where('is_new', true);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $allowedSorts = ['name', 'price', 'rating', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        // Pagination
        $perPage = min($request->get('per_page', 12), 50);
        $products = $query->paginate($perPage);

        return response()->json(['success' => true, 'products' => $products]);
    }
    public function home()
    {
    return response()->json([
        'success' => true,
        'data' => [
            'best_sellers' => Product::with('images')
                ->where('is_best_seller', true)
                ->limit(8)->get(),

            'frozen' => Product::with('images')
                ->where('type', 'frozen')
                ->limit(8)->get(),

            'fresh' => Product::with('images')
                ->where('type', 'fresh')
                ->limit(8)->get(),

            'imported' => Product::with('images')
                ->whereHas('category', fn($q) => $q->where('slug', 'hai-san-nhap-khau'))
                ->limit(8)->get(),

            'shellfish' => Product::with('images')
                ->whereHas('category', fn($q) => $q->where('slug', 'ngao-so-oc'))
                ->limit(8)->get(),

            'crab' => Product::with('images')
                ->whereHas('category', fn($q) => $q->where('slug', 'cua-ghe-tuoi-roi'))
                ->limit(8)->get(),

            'shrimp' => Product::with('images')
                ->whereHas('category', fn($q) => $q->where('slug', 'cac-loai-tom-ngon'))
                ->limit(8)->get(),
        ]
    ]);
}

    public function show($id)
    {
        $product = Product::with(['category', 'images', 'approvedReviews.user'])->findOrFail($id);

        // Related products (same category, exclude current)
        $related = Product::with('images')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return response()->json([
            'success' => true,
            'product' => $product,
            'related' => $related,
        ]);
    }

    public function bestSellers()
    {
        $products = Product::with('images')
            ->where('is_best_seller', true)
            ->limit(8)
            ->get();

        return response()->json(['success' => true, 'products' => $products]);
    }

    public function newProducts()
    {
        $products = Product::with('images')
            ->where('is_new', true)
            ->limit(8)
            ->get();

        return response()->json(['success' => true, 'products' => $products]);
    }

    // Admin methods
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|integer|min:0',
            'original_price' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'origin' => 'nullable|string|max:255',
            'weight' => 'nullable|string|max:100',
            'unit' => 'nullable|string|max:50',
            'type' => 'in:fresh,frozen,dried',
            'is_best_seller' => 'boolean',
            'is_new' => 'boolean',
            'stock' => 'integer|min:0',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $slug = Str::slug($validated['name']);
$originalSlug = $slug;
$i = 1;

while (Product::where('slug', $slug)->exists()) {
    $slug = $originalSlug . '-' . $i++;
}

$validated['slug'] = $slug;
        $product = Product::create($validated);

        // Handle images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                $filename = 'prod_' . $product->id . '_' . time() . '_' . $index . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('uploads/products'), $filename);
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => 'uploads/products/' . $filename,
                    'sort_order' => $index,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'product' => $product->load(['category', 'images']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|integer|min:0',
            'original_price' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'origin' => 'nullable|string|max:255',
            'weight' => 'nullable|string|max:100',
            'unit' => 'nullable|string|max:50',
            'type' => 'in:fresh,frozen,dried',
            'is_best_seller' => 'boolean',
            'is_new' => 'boolean',
            'stock' => 'integer|min:0',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        //sua
if ($request->has('name') && !$request->has('slug')) {
    $validated['slug'] = Str::slug($validated['name']);
}

        $product->update($validated);

        // Handle new images
        if ($request->hasFile('images')) {
            $maxSort = $product->images()->max('sort_order') ?? -1;
            foreach ($request->file('images') as $index => $file) {
                $filename = 'prod_' . $product->id . '_' . time() . '_' . $index . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('uploads/products'), $filename);
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => 'uploads/products/' . $filename,
                    'sort_order' => $maxSort + $index + 1,
                ]);
            }
        }

        // Delete specific images
        if ($request->has('delete_images')) {
            $imageIds = $request->input('delete_images');
            $images = ProductImage::whereIn('id', $imageIds)
                ->where('product_id', $product->id)
                ->get();
            foreach ($images as $img) {
                if (file_exists(public_path($img->image_path))) {
                    unlink(public_path($img->image_path));
                }
                $img->delete();
            }
        }

        return response()->json([
            'success' => true,
            'product' => $product->fresh()->load(['category', 'images']),
        ]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Delete images from disk
        foreach ($product->images as $img) {
            if (file_exists(public_path($img->image_path))) {
                unlink(public_path($img->image_path));
            }
        }

        $product->delete();

        return response()->json(['success' => true, 'message' => 'Đã xóa sản phẩm']);
    }
}
