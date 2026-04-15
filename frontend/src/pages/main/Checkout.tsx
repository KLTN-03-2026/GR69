import { useEffect, useState } from "react";
import { addressService } from "../../services/user/AddressService";
import { useCart } from "../../context/CartContext";
import { couponService } from "../../services/user/couponService";
import { toast } from "react-toastify";
import { orderService } from "../../services/user/orderService";
import { useNavigate } from "react-router-dom";

interface Address {
    id: number;
    name: string;
    phone: string;
    address: string;
    is_default: boolean;
}
interface Coupon {
    id: number;
    code: string;
    label: string;
    type?: string;
    value?: number;
}
function Checkout() {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const { cartItems, subtotal, clearCart } = useCart();
    const [note, setNote] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cod");

    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);
    const [voucherCode, setVoucherCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [voucherMessage, setVoucherMessage] = useState("");
    const [loadingVoucher, setLoadingVoucher] = useState(false);

    const [loadingOrder, setLoadingOrder] = useState(false);

    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const finalTotal = subtotal + shippingFee - discount;

    useEffect(() => {
        addressService.getAll()
            .then((res) => {
                const list = res.data.addresses;
                setAddresses(list);

                const defaultAddr = list.find((a: Address) => a.is_default);
                if (defaultAddr) {
                    setSelectedAddressId(defaultAddr.id);
                }
            })
            .catch(() => {
                console.log("load address failed");
            });
    }, []);

    useEffect(() => {
        couponService.getAll()
            .then(res => {
                setCoupons(res.data.coupons.data);
            });
    }, []);

    const handleApplyVoucher = async () => {
        if (!voucherCode) return;

        try {
            setLoadingVoucher(true);
            const res = await couponService.apply(voucherCode, subtotal);

            if (res.data.success) {
                setDiscount(res.data.discount);
                setVoucherMessage("Áp mã thành công");
            } else {
                setDiscount(0);
                setVoucherMessage(res.data.message || "Mã không hợp lệ");
            }
        } catch (error: any) {
            console.log(error.response?.data);
            setVoucherMessage("Lỗi áp mã");
        } finally {
            setLoadingVoucher(false);
        }
    };

    const handleEditAddress = (id: number) => {
        navigate(`/account/edit-address/${id}`);
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) return;

        const address = addresses.find(a => a.id === selectedAddressId);
        if (!address) return;

        const payload = {
            total_amount: finalTotal,
            shipping_fee: shippingFee,
            discount: discount,
            coupon_code: voucherCode || null,

            shipping_name: address.name,
            shipping_phone: address.phone,
            shipping_address: address.address,
            payment_method: "cod",
            note: note,

            items: cartItems.map(item => ({
                product_id: item.id,
                product_name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
        };

        try {
            setLoadingOrder(true);

            const res = await orderService.create(payload);

            if (res.data.success) {
                toast.success("Đặt hàng thành công!");
                navigate("/order-success");
                clearCart();

            }

        } catch (err) {
            console.log(err);
            toast.error("Đặt hàng thất bại");
        } finally {
            setLoadingOrder(false);
        }
    };
    return (
        <>
            <div className="container mt-4 mb-5">
                <div className="row">
                    <div className="col-lg-7 col-md-12">
                        <div className="checkout-box">
                            <h5>Thông tin giao hàng</h5>
                            <div className="delivery-tabs">
                                <div className="delivery-tab active">
                                    <i className="fa fa-truck text-blue" /> Giao tận nơi
                                </div>
                            </div>
                            <form>
                                {addresses.length === 0 && (
                                    <div className="no-address">
                                        <p>Bạn chưa có địa chỉ nào.</p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => navigate("/account/add-address")}
                                        >
                                            + Thêm địa chỉ mới
                                        </button>
                                    </div>
                                )}
                                {addresses.map(addr => (
                                    <div key={addr.id} className="address-item">
                                        <label className="address-radio">
                                            <input
                                                type="radio"
                                                name="address"
                                                checked={selectedAddressId === addr.id}
                                                onChange={() => setSelectedAddressId(addr.id)}
                                            />
                                            <div>
                                                <strong>{addr.name}</strong> - {addr.phone}
                                                <div>{addr.address}</div>
                                            </div>
                                        </label>

                                        <div className="address-actions">
                                            <button type="button"
                                                className="btn btn-sm btn-warning"
                                                onClick={() => handleEditAddress(addr.id)}
                                            >
                                                Cập nhật
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </form>
                        </div>
                        <div className="checkout-box">
                            <h5>Phương thức thanh toán</h5>
                            <label className="payment-method">
                                <input type="radio" name="payment" defaultChecked />
                                <img src="https://cdn-icons-png.flaticon.com/512/2800/2800164.png" className="payment-icon" alt="COD" /> <span>Thanh Toán Khi Nhận Hàng (COD)</span>
                            </label>
                            <label className="payment-method">
                                <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} name="payment" />
                                <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" className="payment-icon" alt="VNPay" />
                                <span>Thanh toán online qua cổng VNPay (ATM/Visa/MasterCard/JCB/QR Pay trên Mobile Banking)</span>
                            </label>
                        </div>
                        <div className="checkout-box">
                            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} className="form-control" placeholder="Ghi chú đơn hàng" />
                        </div>
                    </div>
                    <div className="col-lg-5 col-md-12">
                        <div className="checkout-box">
                            <h5>Giỏ hàng</h5>

                            {cartItems.length === 0 && (
                                <div>Giỏ hàng trống</div>
                            )}

                            {cartItems.map(item => (
                                <div className="cart-item" key={item.id}>
                                    <img
                                        src={`http://127.0.0.1:8000/${item.image}`}
                                        className="cart-img"
                                        alt={item.name}
                                    />
                                    <div className="cart-info">
                                        <div className="cart-title">
                                            <span>{item.name}</span>
                                        </div>
                                        <div className="cart-price-qty">
                                            <div>
                                                <span className="price-new">
                                                    {item.price.toLocaleString()}đ
                                                </span>
                                            </div>
                                            <div>
                                                x {item.quantity}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="checkout-box">
                            <h5>Mã khuyến mãi</h5>

                            {coupons.length === 0 && (
                                <div>Không có voucher</div>
                            )}

                            {coupons.map(c => (
                                <label key={c.id} className="address-radio">
                                    <input
                                        type="radio"
                                        name="coupon"
                                        checked={selectedCouponId === c.id}
                                        onChange={() => {
                                            setSelectedCouponId(c.id);
                                            setVoucherCode(c.code);
                                            setVoucherMessage("");
                                        }}
                                    />

                                    <div>
                                        <strong>{c.code}</strong> - {c.label}
                                    </div>
                                </label>
                            ))}

                            <div className="input-group mt-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Hoặc nhập mã khác"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                />

                                <div className="input-group-append">
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={handleApplyVoucher}
                                        disabled={loadingVoucher}
                                    >
                                        {loadingVoucher ? "Đang áp dụng..." : "Áp dụng"}
                                    </button>
                                </div>
                            </div>

                            {voucherMessage && (
                                <div style={{ color: discount > 0 ? "green" : "red" }}>
                                    {voucherMessage}
                                </div>
                            )}
                        </div>
                        <div className="checkout-box">
                            <h5>Tóm tắt đơn hàng</h5>
                            <div className="summary-row">
                                <span>Tổng tiền hàng</span>
                                <span>{subtotal.toLocaleString()}đ</span>
                            </div>
                            <div className="summary-row">
                                <span>Giảm giá</span>
                                <span>-{discount.toLocaleString()}đ</span>
                            </div>
                            <div className="summary-row">
                                <span>Phí vận chuyển</span>
                                <span>{shippingFee.toLocaleString()}đ</span>
                            </div>

                            <div className="summary-total">
                                <span>Tổng thanh toán</span>
                                <span>{finalTotal.toLocaleString()}đ</span>
                            </div>
                            <button className="btn btn-checkout" onClick={handlePlaceOrder} disabled={!selectedAddressId} style={{ backgroundColor: "#FFA500", padding: "12px" }}>{loadingOrder ? "Đang xử lý..." : "Đặt hàng"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Checkout;