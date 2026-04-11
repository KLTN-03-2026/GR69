<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $contact = Contact::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất!',
        ], 201);
    }

    // Admin
    public function index(Request $request)
    {
        $query = Contact::query();

        if ($request->has('is_read')) {
            $query->where('is_read', $request->boolean('is_read'));
        }

        $contacts = $query->orderByDesc('created_at')->paginate(20);

        return response()->json(['success' => true, 'contacts' => $contacts]);
    }

    public function markRead($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->update(['is_read' => true]);

        return response()->json(['success' => true, 'contact' => $contact]);
    }

    public function destroy($id)
    {
        Contact::findOrFail($id)->delete();

        return response()->json(['success' => true, 'message' => 'Đã xóa liên hệ']);
    }
}
