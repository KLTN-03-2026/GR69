import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Hero from "../../components/hero/Hero";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import { productService } from "../../services/user/productService";

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

interface Category {
    id: number;
    name: string;
    slug: string;
}
function CategoryPage() {
    const { slug } = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
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

    const { addToCart } = useCart();
    useEffect(() => {
        const fetchCategory = async () => {
            if (!slug) return;

            let params: any = {};
            switch (slug) {
                case "ban-chay-nhat":
                    params.best_seller = true;
                    params.per_page = 100;
                    break;
                case "hai-san-dong-lanh-moi":
                    params.type = "frozen";
                    break;
                case "hai-san-tuoi-song":
                    params.type = "fresh";
                    break;
                case "hai-san-nhap-khau":
                case "ngao-so-oc":
                case "cua-ghe-tuoi-roi":
                case "cac-loai-tom-ngon":
                    params.category_slug = slug;
                    break;
                default:
                    params.category_slug = slug;
            }

            const res = await productService.getAll(params);
            setProducts(res.data.products.data);
            setCategory({
                id: 0,
                name: categories.find(c => c.path.includes(slug))?.name || "Danh mục",
                slug: slug
            });
        };

        fetchCategory();
    }, [slug]);

    return (
        <>
            <Hero categories={categories} />
            <div>
                <div className="breadcrumb-gray">
                    <div className="container">
                        <div className="breadcrumb-inner">
                            <a href="index.html">Trang chủ</a> /
                            <a href="#">Danh mục</a> /
                            <span>{category?.name}</span>
                        </div>
                    </div>
                </div>
                {/* Breadcrumb Xám End */}
                <section className="banner-sale">
                    <div className="container">
                        <img src="/img/user-img/banner/banner_index_1.jpg" alt="Banner hải sản" className="img-banner" />
                    </div>
                </section>
            </div>
            <section className="featured spad">
                <div className="container">
                    <div className="section-title d-flex justify-content-between align-items-center">
                        <h2>{category?.name || "Danh mục sản phẩm"}</h2>
                    </div>
                    <div className="row featured__filter">
                        {products?.map((item) => {
                            return (
                                <div className="col-5-custom" key={item.id}>
                                    <Link to={`/product/${item.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                                        <div className="featured__item">
                                            <div
                                                className="featured__item__pic"
                                                style={{
                                                    backgroundImage: `url(http://127.0.0.1:8000/${item.images?.[0]?.image_path})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                    height: "250px"
                                                }}
                                            >
                                            </div>
                                            <div className="featured__item__text">
                                                <h6>{item.name}</h6>
                                                <div className="price-and-cart">
                                                    <div className="price-box">
                                                        <h5 className="price-sale">
                                                            {item.price.toLocaleString()}đ
                                                            <span className="unit">/ {item.weight}{item.unit}</span>
                                                        </h5>

                                                        {item.original_price && (
                                                            <span className="price-original">
                                                                {item.original_price.toLocaleString()}đ
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button className="add-to-cart-btn"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            addToCart(item, 1);
                                                            toast.success("Đã thêm vào giỏ hàng");

                                                        }}>
                                                        <i className="fa fa-shopping-cart" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
export default CategoryPage;