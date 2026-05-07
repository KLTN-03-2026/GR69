import CategoryDropdown from "../category/CategoryDropDown";
import { useState, useEffect } from "react";
import { productService } from "../../services/user/productService";
import { categoryService } from "../../services/user/categoryService";
import { Link, useNavigate } from "react-router-dom";
import HeroSlider from "./HeroSlider";

function Hero({ showSlider = false }: any) {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dbCategories, setDbCategories] = useState<{name: string, path: string}[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        categoryService.getAll().then(res => {
            const mapped = res.data.categories.map((c: any) => ({
                name: c.name,
                path: `/category/${c.slug}`
            }));
            setDbCategories(mapped);
        }).catch(err => console.error("Failed to load categories", err));
    }, []);

    useEffect(() => {
        if (!keyword.trim()) {
            setResults([]);
            setShowDropdown(false);
            return;
        }
        const timeout = setTimeout(async () => {
            const res = await productService.search(keyword);
            setResults(res.data.data);
            console.log(res.data);
            if (res.data.data.length > 0) {
                setShowDropdown(true);
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [keyword]);

    useEffect(() => {
        const handleClickOutside = () => setShowDropdown(false);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <section className="hero">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3">
                        <CategoryDropdown items={dbCategories} />
                    </div>

                    <div className="col-lg-9">
                        <div className="hero__search">
                            <div className="hero__search__form" style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
                                <form onSubmit={(e) => {e.preventDefault();
                                        if (!keyword.trim()) return;
                                        setShowDropdown(false);
                                        navigate(`/shop-grid?keyword=${keyword}`);
                                    }}>
                                    <input
                                        type="text"
                                        placeholder="Bạn muốn mua gì?"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        onFocus={() => setShowDropdown(true)}
                                    />
                                    <button type="submit" className="site-btn">Tìm kiếm</button>
                                </form>

                                {showDropdown && results.length > 0 && (
                                    <div className="search-dropdown">
                                        {results.slice(0, 5).map(item => (
                                            <Link
                                                to={`/product/${item.slug}`}
                                                key={item.id}
                                                className="search-item"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                <div className="search-left">
                                                    <p>{item.name}</p>
                                                    <span>{item.price.toLocaleString()}đ</span>
                                                </div>
                                                <img
                                                    src={`http://127.0.0.1:8000/${item.images?.[0]?.image_path}`}
                                                    alt=""
                                                />
                                            </Link>
                                        ))}

                                        {results.length > 5 && (
                                            <Link to={`/shop-grid?keyword=${keyword}`} className="search-more"
                                                onClick={() => setShowDropdown(false)}>
                                                Xem thêm {results.length - 5} sản phẩm
                                            </Link>
                                        )}
                                    </div>
                                )}
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
                        {showSlider && <HeroSlider />}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;