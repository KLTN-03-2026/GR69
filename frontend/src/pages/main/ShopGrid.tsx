import { useEffect, useState } from "react";
import { productService } from "../../services/user/productService";
import { Link, useSearchParams } from "react-router-dom";
import Hero from "../../components/hero/Hero";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

function ShopGrid() {
    const [products, setProducts] = useState<any[]>([]);
    const { addToCart } = useCart();
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword");
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

    useEffect(() => {
        const fetchCategory = async () => {
            let res;
            if (keyword) {
                res = await productService.search(keyword);
            } else {
                res = await productService.getAll();
            }
            const products =
                res.data.data || res.data.products?.data || [];

            setProducts(products);
        };

        fetchCategory();
    }, [keyword]);

    return (
        <>
            <Hero categories={categories} />
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
                        <h2>Tất cả sản phẩm</h2>
                    </div>
                    <div className="row featured__filter">
                        {products?.map((item: any) => {
                            return (
                                <div className="col-5-custom" key={item.id}>
                                    <div className="featured__item">
                                        <Link to={`/product/${item.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
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
                                        </Link>
                                        <div className="featured__item__text">
                                            <Link to={`/product/${item.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                                                <h6>{item.name}</h6>
                                            </Link>
                                            <div className="price-and-cart">
                                                <div className="price-box">
                                                    <h5 className="price-sale">
                                                        {item.price.toLocaleString()}đ
                                                        <span className="unit"> / {item.unit}</span>
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
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
export default ShopGrid;