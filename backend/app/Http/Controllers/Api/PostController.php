<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::where('status', 'published');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $posts = $query->orderByDesc('created_at')->paginate(10);

        return response()->json(['success' => true, 'posts' => $posts]);
    }

    public function show($id)
    {
        $post = Post::where('status', 'published')->findOrFail($id);

        return response()->json(['success' => true, 'post' => $post]);
    }

    // Admin methods
    public function adminIndex(Request $request)
    {
        $query = Post::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $posts = $query->orderByDesc('created_at')->paginate(20);

        return response()->json(['success' => true, 'posts' => $posts]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'author' => 'nullable|string|max:255',
            'status' => 'in:published,draft',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['author'] = $validated['author'] ?? 'ObeSeaFood';

        if ($request->hasFile('thumbnail')) {
            $request->validate(['thumbnail' => 'image|mimes:jpeg,png,jpg,webp|max:2048']);
            $file = $request->file('thumbnail');
            $filename = 'post_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/posts'), $filename);
            $validated['thumbnail'] = 'uploads/posts/' . $filename;
        }

        $post = Post::create($validated);

        return response()->json(['success' => true, 'post' => $post], 201);
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'author' => 'nullable|string|max:255',
            'status' => 'in:published,draft',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if ($request->hasFile('thumbnail')) {
            $request->validate(['thumbnail' => 'image|mimes:jpeg,png,jpg,webp|max:2048']);
            if ($post->thumbnail && file_exists(public_path($post->thumbnail))) {
                unlink(public_path($post->thumbnail));
            }
            $file = $request->file('thumbnail');
            $filename = 'post_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/posts'), $filename);
            $validated['thumbnail'] = 'uploads/posts/' . $filename;
        }

        $post->update($validated);

        return response()->json(['success' => true, 'post' => $post->fresh()]);
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);

        if ($post->thumbnail && file_exists(public_path($post->thumbnail))) {
            unlink(public_path($post->thumbnail));
        }

        $post->delete();

        return response()->json(['success' => true, 'message' => 'Đã xóa bài viết']);
    }
}
