<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->unsignedInteger('price');
            $table->unsignedInteger('original_price')->nullable();
            $table->text('description')->nullable();
            $table->string('origin')->nullable();
            $table->string('weight')->nullable();
            $table->string('unit')->default('kg');
            $table->enum('type', ['fresh', 'frozen', 'dried'])->default('fresh');
            $table->boolean('is_best_seller')->default(false);
            $table->boolean('is_new')->default(false);
            $table->unsignedInteger('stock')->default(0);
            $table->decimal('rating', 2, 1)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
