import { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import { categoryService } from "../../services/user/categoryService";
import CategoryDropdown from "../../components/category/CategoryDropDown";

function CategoryPage() {
    const { slug } = useParams();
    const [products, setProducts] = useState<any[]>([]);
    const [category, setCategory] = useState<any>(null);
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
            if (!slug) return;
            const res = await categoryService.getBySlug(slug);

            setCategory(res.data.category);
            setProducts(res.data.products);
        };

        fetchCategory();
    }, [slug]);

    return (
        <>
            <section className="hero">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <CategoryDropdown items={categories}/>
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
                        <a href="category-bestsaler.html" className="btn-view-all">Xem tất cả</a>
                    </div>
                    <div className="row featured__filter">
                        {products?.map((item: any) => {
                            return (
                                <div className="col-5-custom">
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
                                                        <span className="unit"> / {item.unit}</span>
                                                    </h5>

                                                    {item.original_price && (
                                                        <span className="price-original">
                                                            {item.original_price.toLocaleString()}đ
                                                        </span>
                                                    )}
                                                </div>
                                                <a href="#" className="add-to-cart-btn">
                                                    <i className="fa fa-shopping-cart" />
                                                </a>
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
export default CategoryPage;