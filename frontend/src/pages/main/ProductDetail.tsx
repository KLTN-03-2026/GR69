import { useParams } from "react-router-dom";
import CategoryDropdown from "../../components/category/CategoryDropDown";
import { useEffect, useState } from "react";
import { productService } from "../../services/user/productService";
import { useCart } from "../../context/CartContext";

function ProductDetail() {
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
    const [product, setProduct] = useState<any>(null);
    const [mainImage, setMainImage] = useState<string>("");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return;

            const res = await productService.getBySlug(slug);
            setProduct(res.data.product);
            console.log(res.data.product);

            setMainImage(res.data.product.images?.[0]?.image_path);
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

    const {addToCart}=useCart();


    return (
        <>
            <section className="hero">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <CategoryDropdown items={categories} />
                        </div>
                        <div className="col-lg-9">
                            <div className="hero__search">
                                <div className="hero__search__form">
                                    <form action="#">
                                        <input type="text" placeholder="Bạn muốn mua gì?" />
                                        <button type="submit" className="site-btn">Tìm kiếm</button>
                                    </form>
                                </div>
                                <div className="hero__search__phone">
                                    <div className="hero__search__phone__icon">
                                        <i className="fa fa-phone" />
                                    </div>
                                    <div className="hero__search__phone__text">
                                        <h5>09090909</h5>
                                        <span>Hỗ trợ 24/7</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div>
                <div className="breadcrumb-gray">
                    <div className="container">
                        <div className="breadcrumb-inner">
                            <a href="index.html">Trang chủ</a> /
                            <a href="#">Danh mục</a> /
                            <span>Cửa hàng</span>
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
                                    {product.images?.map((img: any, index: number) => (
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
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star-half-o" />
                                    <span>(95 đánh giá)</span>
                                </div>
                                <p className="product-detail__meta">
                                    <span className="label">Tình trạng:</span> {product.type}
                                </p>

                                <p className="product-detail__meta">
                                    <span className="label">Xuất xứ:</span> {product.origin}
                                </p>

                                <div className="product-detail__price">
                                    <span className="product-detail__price-current">{product.price.toLocaleString()}đ</span>
                                    <span className="product-detail__price-old">{product.original_price.toLocaleString()}đ</span>
                                </div>
                                <p className="product-detail__unit">
                                    Quy cách: {product.weight} {product.unit || "N/A"}
                                </p>
                                <div className="product-detail__quantity">
                                    <span className="product-detail__label">Số lượng:</span>
                                    <div className="product-detail__qty-control">
                                        <button className="product-detail__qty-btn" onClick={decreaseQty} >-</button>
                                        <input className="product-detail__qty-input" type=" number" id="qty" value={quantity}
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
                                                    <i className="fa fa-star" />
                                                    <i className="fa fa-star" />
                                                    <i className="fa fa-star" />
                                                    <i className="fa fa-star" />
                                                    <i className="fa fa-star-half-o" />
                                                    <span>( 95 Reviews )</span>
                                                </div>
                                                <div className="review-list">
                                                    <div className="review-item">
                                                        <img src="https://via.placeholder.com/60?text=Image" alt="Avatar" className="review-avatar" />
                                                        <div className="review-content">
                                                            <div className="review-meta">
                                                                <h5>Adam Smit</h5>
                                                                <span className="review-date">September 3, 2020</span>
                                                            </div>
                                                            <div className="review-stars">
                                                                <i className="fa fa-star" />
                                                                <i className="fa fa-star" />
                                                                <i className="fa fa-star" />
                                                                <i className="fa fa-star" />
                                                                <i className="fa fa-star-o" />
                                                            </div>
                                                            <p className="review-text">
                                                                Hải sản rất tươi ngon, giao hàng cực kỳ nhanh chóng. Rất hài lòng
                                                                với dịch vụ của shop!
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="review-item">
                                                        <img src="https://via.placeholder.com/60?text=User2" alt="Avatar" className="review-avatar" />
                                                        <div className="review-content">
                                                            <div className="review-meta">
                                                                <h5>Nguyễn Văn A</h5>
                                                                <span className="review-date">October 15, 2023</span>
                                                            </div>
                                                            <div className="review-stars">
                                                                <i className="fa fa-star" />
                                                                <i className="fa fa-star" />
                                                                <i className="fa fa-star" />
                                                                <i className="fa fa-star" />
                                                                <i className="fa fa-star" />
                                                            </div>
                                                            <p className="review-text">
                                                                Bào ngư dai giòn sần sật, nấu cháo cho các bé ăn rất tốt. Mọi người
                                                                nên mua thử nhé.
                                                            </p>
                                                        </div>
                                                    </div>
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