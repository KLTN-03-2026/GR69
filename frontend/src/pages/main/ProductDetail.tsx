import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { productService } from "../../services/user/productService";
import { useCart } from "../../context/CartContext";
import Hero from "../../components/hero/Hero";
import { reviewService } from "../../services/user/reviewService";


interface ProductImage {
    id: number;
    image_path: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    original_price?: number;
    description?: string;
    type?: "fresh" | "frozen" | "dried";
    origin?: string;
    weight?: string;
    unit?: string;

    stock?: number;
    rating?: number;
    is_best_seller?: boolean;
    is_new?: boolean;

    images?: ProductImage[];
}

interface User {
    id: number;
    name: string;
    avatar?: string | null;
}

interface Review {
    id: number;
    product_id: number;
    user_id: number;
    rating: number;
    comment: string;
    created_at: string;
    user: User;
}
function ProductDetail() {
    const { addToCart } = useCart();
    const categories = [
        { name: "Bán chạy nhất", path: "/category/ban-chay-nhat" },
        { name: "Hải sản đông lạnh", path: "/category/hai-san-dong-lanh-moi" },
        { name: "Hải sản tươi sống", path: "/category/hai-san-tuoi-song" },
        { name: "Hải sản nhập khẩu", path: "/category/hai-san-nhap-khau" },
        { name: "Cá hồi", path: "/category/ca-hoi" },
        { name: "Hàu sữa", path: "/category/hau-sua-viet-nam-va-nhap-khau" },
        { name: "Ngao, sò, ốc", path: "/category/ngao-so-oc" },
        { name: "Cua, ghẹ", path: "/category/cua-ghe-tuoi-roi" },
        { name: "Tôm các loại", path: "/category/cac-loai-tom-ngon" },
        { name: "Mực", path: "/category/muc-tuoi-moi-ngay" },
    ];
    const { slug } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [mainImage, setMainImage] = useState<string | undefined>();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return;

            try {
                const res = await productService.getBySlug(slug);
                const productData = res.data.product;

                setProduct(productData);
                setMainImage(productData.images?.[0]?.image_path);

                const reviewRes = await reviewService.getByProduct(productData.id);
                setReviews(reviewRes.data.reviews);
                console.log(reviewRes.data);

            } catch (err) {
                console.log("Lỗi load product");
            }
        };

        fetchProduct();
    }, [slug]);

    if (!product) return <div>Loading...</div>;
    const increaseQty = () => {
        setQuantity((prev) => prev + 1);
    };
    const decreaseQty = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const avgRating = reviews.length > 0 ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)) : 0;
    return (
        <>
            <Hero categories={categories} />
            <div>
                <div className="breadcrumb-gray">
                    <div className="container">
                        <div className="breadcrumb-inner">
                            <a href="index.html">Trang chủ</a> /
                            <span>{product.name}</span>
                        </div>
                    </div>
                </div>
            </div>
            <section className="product-details spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="product__details__pic">
                                <div className="product__details__pic__item">
                                    <img
                                        className="product__details__pic__item--large"
                                        src={`http://127.0.0.1:8000/${mainImage}`}
                                        alt={product.name}
                                    />
                                </div>
                                <div className="product__details__pic__slider">
                                    {product.images?.map((img: ProductImage, index: number) => (
                                        <img
                                            key={index}
                                            src={`http://127.0.0.1:8000/${img.image_path}`}
                                            alt=""
                                            className={`thumbnail ${mainImage === img.image_path ? "active" : ""}`}
                                            onClick={() => setMainImage(img.image_path)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="product-detail">
                                <h3 className="product-detail__title">{product.name}</h3>
                                <div className="product-detail__rating">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        if (avgRating >= star) {
                                            return <i key={star} className="fa fa-star" />;
                                        } else if (avgRating >= star - 0.5) {
                                            return <i key={star} className="fa fa-star-half-o" />;
                                        } else {
                                            return <i key={star} className="fa fa-star-o" />;
                                        }
                                    })}
                                    <span>({reviews.length} đánh giá)</span>
                                </div>
                                <p className="product-detail__meta">
                                    <span className="label">Tình trạng:</span> {product.type}
                                </p>

                                <p className="product-detail__meta">
                                    <span className="label">Xuất xứ:</span> {product.origin}
                                </p>

                                <div className="product-detail__price">
                                    <span className="product-detail__price-current">{product.price.toLocaleString()}đ</span>
                                    {product.original_price && (
                                        <span className="product-detail__price-old">
                                            {product.original_price.toLocaleString()}đ
                                        </span>
                                    )}
                                </div>
                                <p className="product-detail__unit">
                                    Quy cách: {product.weight} {product.unit || "N/A"}
                                </p>
                                <div className="product-detail__quantity">
                                    <span className="product-detail__label">Số lượng:</span>
                                    <div className="product-detail__qty-control">
                                        <button className="product-detail__qty-btn" onClick={decreaseQty} >-</button>
                                        <input className="product-detail__qty-input" type="number" id="qty" value={quantity}
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                if (val >= 1) setQuantity(val);
                                            }} />
                                        <button className="product-detail__qty-btn" onClick={increaseQty}>+</button>
                                    </div>
                                </div>
                                <button
                                    className="product-detail__add-cart"
                                    onClick={() => {
                                        addToCart(product, quantity);
                                    }}
                                >
                                    Thêm vào giỏ
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="product__details__tab">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activeTab === "description" ? "active" : ""}`}
                                            onClick={() => setActiveTab("description")}>Mô tả
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activeTab === "review" ? "active" : ""}`}
                                            onClick={() => setActiveTab("review")}>Đánh giá
                                        </button>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    {activeTab === "description" && (
                                        <div className="tab-pane active">
                                            <div className="product__details__tab__desc">
                                                <h6>Thông tin sản phẩm</h6>
                                                <p>{product.description}</p>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "review" && (
                                        <div className="tab-pane active">
                                            <div className="review-wrapper">
                                                <h4 className="review-title">Đánh giá của khách hàng</h4>
                                                <div className="review-overall">
                                                    <span>{avgRating} / 5</span>
                                                    <span> ({reviews.length} đánh giá)</span>
                                                </div>
                                                <div className="review-list">
                                                    {reviews.length === 0 ? (
                                                        <p>Chưa có đánh giá nào</p>
                                                    ) : (
                                                        reviews.map((item) => (
                                                            <div className="review-item" key={item.id}>
                                                                <img
                                                                    src={`http://127.0.0.1:8000/${item.user.avatar}` || "https://via.placeholder.com/60"}
                                                                    alt="Avatar"
                                                                    className="review-avatar"
                                                                />
                                                                <div className="review-content">
                                                                    <div className="review-meta">
                                                                        <h5>{item.user?.name}</h5>
                                                                        <span className="review-date">
                                                                            {new Date(item.created_at).toLocaleDateString("vi-VN")}
                                                                        </span>
                                                                    </div>
                                                                    <div className="review-stars">
                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                            <i
                                                                                key={star}
                                                                                className={`fa ${star <= item.rating ? "fa-star" : "fa-star-o"
                                                                                    }`}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <p className="review-text">{item.comment}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
export default ProductDetail;