import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../assets/main/css/font-awesome.min.css';
import '../assets/main/css/elegant-icons.css';
import '../assets/main/css/nice-select.css';
import '../assets/main/css/owl.carousel.min.css';
import '../assets/main/css/slicknav.min.css';
import '../assets/main/css/style.css';

function MainLayout() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

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
                                    <li className="active"><a href="./index.html">Trang chủ</a></li>
                                    <li><a href="./shop-grid.html">Cửa hàng</a></li>
                                    <li><a href="#">Trang</a>
                                        <ul className="header__menu__dropdown">
                                            <li><a href="./user-infomation.html">Tài khoản</a></li>
                                            <li><a href="./shoping-cart.html">Giỏ hàng</a></li>
                                            <li><a href="./checkout.html">Thanh toán</a></li>
                                        </ul>
                                    </li>
                                    <li><a href="./contact.html">Liên hệ</a></li>
                                </ul>
                            </nav>
                        </div>
                        <div className="col-lg-3">
                            <div className="header__cart">
                                <ul>
                                    <li><a href="shoping-cart.html"><i className="fa fa-shopping-cart" /><span>3</span></a></li>
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
                                            src="img/user-img/logo_main.png"
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
                                    <li><a href="#">Về chúng tôi</a></li>
                                    <li><a href="#">Mua sắm an toàn</a></li>
                                    <li><a href="#">Thông tin giao hàng</a></li>
                                    <li><a href="#">Chính sách</a></li>
                                    <li><a href="contact.html">Địa chỉ của shop</a></li>
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