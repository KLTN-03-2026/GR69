import { Link } from "react-router-dom";
import CategoryDropdown from "../../components/category/CategoryDropDown";
import { useCart } from "../../context/CartContext";
import Hero from "../../components/hero/Hero";

function Cart() {
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
    const BASE_URL = "http://127.0.0.1:8000/";

    const {
        cartItems,
        increaseQty,
        decreaseQty,
        removeItem,
        subtotal,
        total
    } = useCart();
    const shippingFee = 30000;
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
            </div>
            <section className="cart">
                <div className="container">
                    <div className="row">
                        {/* LEFT */}
                        <div className="col-lg-8">
                            <div className="cart__list">
                                {cartItems.map((item) => (
                                    <div className="cart__item" key={item.id}>
                                        <img className="cart__item-image" src={`${BASE_URL}${item.image}`} />
                                        <div className="cart__item-info">
                                            <h6 className="cart__item-name">
                                                {item.name}
                                            </h6>
                                            <p className="cart__item-price">
                                                {item.price.toLocaleString()}đ
                                            </p>
                                            <div className="cart__quantity">
                                                <button className="cart__quantity-btn" onClick={() => decreaseQty(item.id)}>-</button>
                                                <input className="cart__quantity-input" value={item.quantity} readOnly />
                                                <button className="cart__quantity-btn" onClick={() => increaseQty(item.id)}>+</button>
                                            </div>
                                        </div>

                                        <div className="cart__item-total-group">
                                            <div className="cart__item-total">
                                                {(item.price * item.quantity).toLocaleString()}đ
                                            </div>
                                            <div className="cart__item-remove" onClick={() => removeItem(item.id)}>
                                                <i className="fa fa-times" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* RIGHT */}
                        <div className="col-lg-4">
                            <div className="cart__summary">
                                <h5 className="cart__summary-title">TÓM TẮT ĐƠN HÀNG</h5>

                                <div className="cart__summary-row">
                                    <span>Tạm tính:</span>
                                    <span>{subtotal.toLocaleString()}đ</span>
                                </div>

                                <div className="cart__summary-row">
                                    <span>Phí vận chuyển:</span>
                                    <span>{shippingFee.toLocaleString()}đ</span>
                                </div>

                                <hr />

                                <div className="cart__total">
                                    <span>Tổng tiền:</span>
                                    <strong>{total.toLocaleString()}đ</strong>
                                </div>

                                <Link to="/checkout">
                                    <button className="cart__checkout-btn">
                                        Tiến hành thanh toán
                                    </button>
                                </Link>

                                <div className="cart__continue">
                                    <a href="/">← Tiếp tục mua hàng</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
export default Cart;