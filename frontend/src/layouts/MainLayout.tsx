import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../assets/main/css/font-awesome.min.css';
import '../assets/main/css/elegant-icons.css';
import '../assets/main/css/nice-select.css';
import '../assets/main/css/owl.carousel.min.css';
import '../assets/main/css/slicknav.min.css';
import '../assets/main/css/style.css';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import { productService } from '../services/user/productService';

function MainLayout() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    const { cartItems, removeItem } = useCart();

    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth/login");
    }
    function renderHeader() {
        if (token && user) {
            return (
                <>
                    <div className="header__top__right__auth">
                        <button onClick={handleLogout} className="logout-btn">
                            <i className="fa fa-user" /> Đăng xuất
                        </button>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="header__top__right__auth">
                        <Link to="/auth/login"><i className="fa fa-user" />Đăng nhập</Link>
                    </div>
                    <div className="header__top__right__auth">
                        <Link to="/auth/register"><i className="fa fa-user" />Đăng ký</Link>
                    </div>
                </>
            );
        }
    }

    useEffect(() => {
        if (!keyword.trim()) {
            setResults([]);
            return;
        }
        const timeout = setTimeout(async () => {
            try {
                const res = await productService.search(keyword);
                setResults(res.data.data);
                setShowDropdown(true);
            } catch (err) {
                console.log(err);
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [keyword]);

    
    return (
        <>
            <header className="header">
                <div className="header__top">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-md-12">
                                <div className="header__top__right">
                                    <div className="header__top__right__social">
                                        <a href="#"><i className="fa fa-facebook" /></a>
                                        <a href="#"><i className="fa fa-twitter" /></a>
                                        <a href="#"><i className="fa fa-linkedin" /></a>
                                        <a href="#"><i className="fa fa-pinterest-p" /></a>
                                    </div>
                                    {renderHeader()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="header__logo">
                                <Link to="/">
                                    <img
                                        src="/img/user-img/logo_main.png"
                                        alt="Fishmarket Logo"
                                        style={{ width: '160px', height: '60px' }}
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <nav className="header__menu">
                                <ul>
                                    <li className="active"><Link to="/">Trang chủ</Link></li>
                                    <li><Link to="/shop-grid">Cửa hàng</Link></li>
                                    <li><a href="#">Trang</a>
                                        <ul className="header__menu__dropdown">
                                            <li><Link to="/account/my-info">Tài khoản</Link></li>
                                            <li><Link to="/shoping-cart">Giỏ hàng</Link></li>
                                            <li><Link to="/checkout">Thanh toán</Link></li>
                                        </ul>
                                    </li>
                                    <li><Link to="/contact">Liên hệ</Link></li>
                                </ul>
                            </nav>
                        </div>
                        <div className="col-lg-3">
                            <div className="header__cart">
                                <ul>
                                    <li className="cart-hover">
                                        <Link to="/shoping-cart">
                                            <i className="fa fa-shopping-cart" />
                                            <span>{cartItems.length}</span>
                                        </Link>

                                        <div className="cart-dropdown">
                                            {cartItems.length === 0 ? (
                                                <p className="empty-cart">Giỏ hàng trống</p>
                                            ) : (
                                                <>
                                                    {cartItems.map(item => (
                                                        <div className="cart-item" key={item.id}>
                                                            <img
                                                                src={`http://127.0.0.1:8000/${item.image}`}
                                                                alt=""
                                                            />
                                                            <div className="cart-info">
                                                                <p>{item.name}</p>
                                                                <span>
                                                                    {item.price.toLocaleString()}đ x{item.quantity}
                                                                </span>
                                                            </div>
                                                            <div className="cart-remove"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    removeItem(item.id);
                                                                }}>
                                                                <i className="fa fa-trash" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="cart-total">
                                                        Tổng tiền:{" "}
                                                        <p>
                                                            {cartItems
                                                                .reduce((sum, i) => sum + i.price * i.quantity, 0)
                                                                .toLocaleString()}đ
                                                        </p>
                                                    </div>

                                                    <Link to="/shoping-cart" className="view-cart-btn">
                                                        Xem giỏ hàng
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="humberger__open">
                        <i className="fa fa-bars" />
                    </div>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
            <footer className="footer spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="footer__about">
                                <div className="footer__about__logo" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <a href="./index.html">
                                        <img
                                            src="../img/user-img/logo_main.png"
                                            alt="Fishmarket Logo"
                                            style={{ width: '150px', height: '100px' }}
                                        />
                                    </a>
                                </div>
                                <ul>
                                    <li>Địa chỉ: 999 Nguyễn Tất Thành, Xuân Hà, Thanh Khê, Đà Nẵng</li>
                                    <li>Điện thoại: +09090909</li>
                                    <li>Email: fishmarket@gmail.com</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6 offset-lg-1">
                            <div className="footer__widget">
                                <h6>Liên kết hữu ích</h6>
                                <ul>
                                    <li><Link to="#">Về chúng tôi</Link></li>
                                    <li><Link to="#">Mua sắm an toàn</Link></li>
                                    <li><Link to="#">Thông tin giao hàng</Link></li>
                                    <li><Link to="#">Chính sách</Link></li>
                                    <li><Link to="/contact">Địa chỉ của shop</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12">
                            <div className="footer__widget">
                                <h6>Đăng ký thông báo ngay</h6>
                                <p>Nhận thông tin mới nhất qua email về cửa hàng và các ưu đãi đặc biệt của chúng tôi..</p>
                                <form action="#">
                                    <input type="text" placeholder="Nhập email của bạn" />
                                    <button type="submit" className="site-btn">Đăng ký</button>
                                </form>
                                <div className="footer__widget__social">
                                    <a href="#"><i className="fa fa-facebook" /></a>
                                    <a href="#"><i className="fa fa-instagram" /></a>
                                    <a href="#"><i className="fa fa-twitter" /></a>
                                    <a href="#"><i className="fa fa-pinterest" /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
export default MainLayout;