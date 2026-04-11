<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Review;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalRevenue = Order::where('status', 'delivered')->sum('total_amount');
        $totalOrders = Order::count();
        $totalProducts = Product::count();
        $totalCustomers = User::where('role', 'user')->count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $pendingReviews = Review::where('status', 'pending')->count();
        $unreadContacts = Contact::where('is_read', false)->count();

        // Recent orders
        $recentOrders = Order::with('user:id,name,email')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        // Top selling products
        $topProducts = Product::withCount(['orderItems as units_sold' => function ($q) {
                $q->select(DB::raw('COALESCE(SUM(quantity), 0)'));
            }])
            ->orderByDesc('units_sold')
            ->limit(5)
            ->get();

        // Revenue by month (last 6 months)
        $monthlyRevenue = Order::where('status', 'delivered')
            ->where('created_at', '>=', now()->subMonths(6))
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('YEAR(created_at) as year'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Order status breakdown
        $ordersByStatus = Order::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get();

        return response()->json([
            'success' => true,
            'stats' => [
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'total_products' => $totalProducts,
                'total_customers' => $totalCustomers,
                'pending_orders' => $pendingOrders,
                'pending_reviews' => $pendingReviews,
                'unread_contacts' => $unreadContacts,
            ],
            'recent_orders' => $recentOrders,
            'top_products' => $topProducts,
            'monthly_revenue' => $monthlyRevenue,
            'orders_by_status' => $ordersByStatus,
        ]);
    }

    public function customers(Request $request)
    {
        $query = User::where('role', 'user')
            ->withCount('orders')
            ->withSum('orders', 'total_amount');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $customers = $query->orderByDesc('created_at')->paginate(20);

        return response()->json(['success' => true, 'customers' => $customers]);
    }
}
