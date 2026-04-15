import { Link } from "react-router-dom";
import CategorySlider from "../../components/category/CategorySlider";
import FlashSale from "../../components/flashsale/FlashSale";
import { useEffect, useState } from "react";
import { productService } from "../../services/user/productService";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import Hero from "../../components/hero/Hero";


function Home() {
    const [data, setData] = useState<any>([]);
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
        const fetchHome = async () => {
            const res = await productService.getHome();
            setData(res.data.data);
            console.log(res.data.data);
        };

        fetchHome();
    }, []);

    return (
        <>
            <Hero categories={categories} showSlider />
            <section className="categories">
                <div className="container">
                    <CategorySlider />
                </div>
            </section>
            <section className="featured spad">
                <div className="container">
                    <div className="section-title d-flex justify-content-between align-items-center">
                        <h2>Hải sản bán chạy</h2>
                        <Link to="/category/ban-chay-nhat" className="btn-view-all">Xem tất cả</Link>
                    </div>
                    <div className="row featured__filter">
                        {data.best_sellers?.map((item: any) => {
                            return (
                                <div className="col-5-custom">
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
                                                        <span className="unit">/ {item.unit}</span>
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
            <section className="flash-sale-section">
                <FlashSale data={data.fresh} />
            </section>
            <section className="banner-sale">
                <div className="container">
                    <img src="img/user-img/banner/banner_index_1.jpg" alt="Banner hải sản" className="img-banner" />
                </div>
            </section>
            {/* Hải sản đông lạnh Begin */}
            <section className="featured spad">
                <div className="container">
                    {/* Title */}
                    <div className="section-title">
                        <h2>Hải sản đông lạnh</h2>
                        <Link to="/category/hai-san-dong-lanh-moi" className="btn-view-all">Xem tất cả</Link>
                    </div>
                    <div className="row featured__filter">
                        {data.best_sellers?.map((item: any) => {
                            return (
                                <div className="col-5-custom">
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
                                                        <span className="unit">/ {item.unit}</span>
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
            {/* Hải sản đông lạnh End */}

            <section className="banner-sale">
                <div className="container">
                    <img src="img/user-img/banner/banner_index_2.jpg" alt="Banner hải sản" className="img-banner" />
                </div>
            </section>

            {/* Hai san nhap khau */}
            <section className="featured spad">
                <div className="container">
                    <div className="section-title d-flex justify-content-between align-items-center">
                        <h2>Hải sản nhập khẩu</h2>
                        <Link to="/category/hai-san-nhap-khau" className="btn-view-all">Xem tất cả</Link>
                    </div>
                    <div className="row featured__filter">
                        {data.imported?.map((item: any) => {
                            return (
                                <div className="col-5-custom">
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

            {/* Ngao - Sò - Ốc Begin */}
            <section className="featured spad">
                <div className="container">
                    <div className="section-title d-flex justify-content-between align-items-center">
                        <h2>Ngao - Sò - Ốc</h2>
                        <Link to="/category/ngao-so-oc" className="btn-view-all">Xem tất cả</Link>
                    </div>
                    <div className="row featured__filter">
                        {data.shellfish?.map((item: any) => {
                            return (
                                <div className="col-5-custom">
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


            {/*Cua ghẹ */}
            <section className="featured spad">
                <div className="container">
                    <div className="section-title d-flex justify-content-between align-items-center">
                        <h2>Cua - ghẹ</h2>
                        <Link to="/category/cua-ghe-tuoi-roi" className="btn-view-all">Xem tất cả</Link>
                    </div>
                    <div className="row featured__filter">
                        {data.crab?.map((item: any) => {
                            return (
                                <div className="col-5-custom">
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

            {/* Mực */}
            <section className="featured spad">
                <div className="container">
                    <div className="section-title d-flex justify-content-between align-items-center">
                        <h2>Mực</h2>
                        <Link to="/category/muc-tuoi-moi-ngay" className="btn-view-all">Xem tất cả</Link>
                    </div>
                    <div className="row featured__filter">
                        {data.shrimp?.map((item: any) => {
                            return (
                                <div className="col-5-custom">
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
export default Home;