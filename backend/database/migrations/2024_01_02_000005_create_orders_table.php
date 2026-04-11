<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedInteger('total_amount');
            $table->unsignedInteger('shipping_fee')->default(0);
            $table->string('coupon_code')->nullable();
            $table->unsignedInteger('discount')->default(0);
            $table->enum('status', ['pending', 'processing', 'shipping', 'delivered', 'cancelled'])->default('pending');
            $table->string('shipping_name');
            $table->string('shipping_phone', 20);
            $table->text('shipping_address');
            $table->enum('payment_method', ['cod', 'banking', 'ewallet'])->default('cod');
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
