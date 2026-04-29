<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

// Products
Route::get('/home', [ProductController::class, 'home']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/best-sellers', [ProductController::class, 'bestSellers']);
Route::get('/products/new', [ProductController::class, 'newProducts']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/slug/{slug}', [ProductController::class, 'showBySlug']);

// Reviews (public - read only)
Route::get('/products/{id}/reviews', [ReviewController::class, 'productReviews']);

// Posts (public)
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);

// Coupon check
Route::get('/coupons', [CouponController::class, 'index']);
Route::post('/coupons/apply', [CouponController::class, 'apply']);

// Contact
Route::post('/contact', [ContactController::class, 'store']);

//product
Route::get('/search', [ProductController::class, 'search']);

/*
|--------------------------------------------------------------------------
| Authenticated User Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/user/profile', [AuthController::class, 'updateProfile']); // For multipart/form-data
    Route::put('/user/password', [AuthController::class, 'changePassword']);

    // Addresses
    Route::get('/addresses', [AddressController::class, 'index']);
    Route::get('/addresses/{id}', [AddressController::class, 'show']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{id}', [AddressController::class, 'update']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);
    Route::put('/addresses/{id}/default', [AddressController::class, 'setDefault']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::get('/admin/orders/{id}', [OrderController::class, 'adminShow']);
    Route::put('/orders/{id}/cancel', [OrderController::class, 'cancel']);
    

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist/{productId}', [WishlistController::class, 'toggle']);

    /*
    |--------------------------------------------------------------------------
    | Admin Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware(\App\Http\Middleware\AdminMiddleware::class)->prefix('admin')->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::get('/customers', [DashboardController::class, 'customers']);

        // Categories
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::post('/categories/{id}', [CategoryController::class, 'update']); // For multipart/form-data
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // Products
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::post('/products/{id}', [ProductController::class, 'update']); // For multipart/form-data
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        // Orders
        Route::get('/orders', [OrderController::class, 'adminIndex']);
        Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

        // Reviews
        Route::get('/reviews', [ReviewController::class, 'adminIndex']);
        Route::put('/reviews/{id}/status', [ReviewController::class, 'updateStatus']);
        Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

        // Posts
        Route::get('/posts', [PostController::class, 'adminIndex']);
        Route::post('/posts', [PostController::class, 'store']);
        Route::put('/posts/{id}', [PostController::class, 'update']);
        Route::post('/posts/{id}', [PostController::class, 'update']); // For multipart/form-data
        Route::delete('/posts/{id}', [PostController::class, 'destroy']);

        // Contacts
        Route::get('/contacts', [ContactController::class, 'index']);
        Route::put('/contacts/{id}/read', [ContactController::class, 'markRead']);
        Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);

        //voucher
        Route::get('/coupons', [CouponController::class, 'index']);     // list
        Route::get('/coupons/{id}', [CouponController::class, 'show']); // detail

        Route::post('/coupons', [CouponController::class, 'store']);    // create
        Route::put('/coupons/{id}', [CouponController::class, 'update']); // update
        Route::delete('/coupons/{id}', [CouponController::class, 'destroy']); // delete
    });
});
