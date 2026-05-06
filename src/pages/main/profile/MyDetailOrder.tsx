import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderService } from "../../../services/user/orderService";
import { toast } from "react-toastify";
import { reviewService } from "../../../services/user/reviewService";

interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    price: number;
    quantity: number;
    reviewed?: boolean;
    product?: {
        images?: { image_path: string }[];
    };
}

interface Order {
    id: number;
    created_at: string;
    status: string;
    total_amount: number;
    payment_method: string;
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    items: OrderItem[];
}

function MyDetailOrder() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [showReview, setShowReview] = useState(false);
    const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;

        orderService.getById(Number(id))
            .then(res => {
                setOrder(res.data.order);
                console.log(res.data.order);
            })
            .catch(() => {
                console.log("load order failed");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("vi-VN");
    };

    const getStatus = (status: string) => {
        switch (status) {
            case "pending": return { label: "Chờ xác nhận", class: "badge-warning" };
            case "processing": return { label: "Đang xử lý", class: "badge-primary" };
            case "shipping": return { label: "Đang giao", class: "badge-info" };
            case "delivered": return { label: "Hoàn thành", class: "badge-green" };
            case "cancelled": return { label: "Đã hủy", class: "badge-danger" };
            default: return { label: status, class: "" };
        }
    };

    const getPayment = (method: string) => {
        if (method === "cod") return "Thanh toán khi nhận hàng";
        if (method === "banking") return "Chuyển khoản";
        if (method === "ewallet") return "Ví điện tử";
        return method;
    };

    if (loading) return <div>Đang tải...</div>;
    if (!order) return <div>Không tìm thấy đơn hàng</div>;
    const status = getStatus(order.status);

    const handleCancelOrder = () => {
        if (!order) return;
        if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
        orderService.cancelOrder(order.id)
            .then(() => {
                toast.success("Đã hủy đơn hàng");
                setOrder({ ...order, status: "cancelled" });
            })
            .catch(() => {
                toast.error("Hủy đơn thất bại");
            });
    };

    const handleSubmitReview = () => {
        if (!selectedItem || submitting) return;

        setSubmitting(true);
        reviewService.create({
            product_id: selectedItem.product_id,
            order_id: order.id,
            rating,
            comment
        })
            .then(() => {
                toast.success("Đánh giá thành công!");
                if (order && selectedItem) {
                    const updatedItems = order.items.map(i =>
                        i.id === selectedItem.id ? { ...i, reviewed: true } : i
                    );
                    setOrder({ ...order, items: updatedItems });
                }
                setShowReview(false);
                setRating(5);
                setComment("");
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || "Lỗi");
            })
            .finally(() => setSubmitting(false));
    };
    return (
        <>
            <div className="order-detail-card">
                <h2 className="main-heading">Chi tiết đơn hàng #{order.id}</h2>

                <div className="info-text">Ngày đặt: {formatDate(order.created_at)}</div>

                <div className="info-text">
                    Trạng thái: <span className={status.class}>{status.label}</span>
                </div>

                <div className="info-text">
                    Phương thức thanh toán:
                    <span className="badge-blue"> {getPayment(order.payment_method)}</span>
                </div>

                <div className="info-text">
                    Tổng tiền: {order.total_amount.toLocaleString()} đ
                </div>

                <div className="mt-3">
                    {order.status === "pending" && (
                        <button
                            className="btn btn-danger"
                            onClick={handleCancelOrder}
                        >
                            Hủy đơn hàng
                        </button>
                    )}
                </div>

                {/* Products */}
                <h3 className="section-title">Sản phẩm trong đơn hàng</h3>

                <div className="table-responsive">
                    <table className="detail-table">
                        <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Sản phẩm</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>

                        <tbody>
                            {order.items.map(item => {
                                const image = item.product?.images?.[0]?.image_path || "default.jpg";

                                return (
                                    <tr key={item.id}>
                                        <td>
                                            <img
                                                src={`http://127.0.0.1:8000/${image}`}
                                                className="product-img"
                                                alt={item.product_name}
                                            />
                                        </td>

                                        <td>{item.product_name}</td>

                                        <td>{item.price.toLocaleString()} đ</td>

                                        <td>{item.quantity}</td>

                                        <td>
                                            {(item.price * item.quantity).toLocaleString()} đ
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Shipping info */}
                <h3 className="section-title">Thông tin giao hàng</h3>

                <div className="info-text">Người nhận: {order.shipping_name}</div>
                <div className="info-text">Địa chỉ: {order.shipping_address}</div>
                <div className="info-text">SĐT: {order.shipping_phone}</div>

                {/* Review */}
                <h3 className="section-title">Đánh giá sản phẩm</h3>

                <div className="table-responsive">
                    <table className="detail-table">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th style={{ textAlign: "center" }}>Đánh giá</th>
                            </tr>
                        </thead>

                        <tbody>
                            {order.items.map(item => (
                                <tr key={item.id}>
                                    <td>{item.product_name}</td>
                                    <td style={{ textAlign: "center" }}>
                                        {order.status === "delivered" ? (
                                            item.reviewed ? (
                                                <span style={{ color: "green" }}>Đã đánh giá</span>
                                            ) : (
                                                <a href="#" className="btn-text-rate" onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedItem(item);
                                                    setShowReview(true);
                                                }}>
                                                    Đánh giá
                                                </a>
                                            )
                                        ) : (
                                            <span style={{ color: "#999" }}>
                                                Chưa thể đánh giá
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showReview && selectedItem && (
                <div className="review-modal" onClick={() => setShowReview(false)}>
                    <div className="review-box" onClick={(e) => e.stopPropagation()}>
                        <h4>Đánh giá sản phẩm</h4>
                        <p>Đơn hàng: #{order.id}</p>
                        <div className="review-product">
                            <img
                                src={`http://127.0.0.1:8000/${selectedItem.product?.images?.[0]?.image_path || "default.jpg"}`}
                                alt={selectedItem.product_name}
                            />

                            <div className="review-product-info">
                                <p className="name">{selectedItem.product_name}</p>
                                <p className="qty">Số lượng: {selectedItem.quantity}</p>
                            </div>
                        </div>

                        <div className="rating">
                            <span>Chất lượng sản phẩm: </span>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={star <= rating ? "star active" : "star"}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea
                            placeholder="Nhập đánh giá của bạn..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="review-actions">
                            <button onClick={() => setShowReview(false)}>
                                Hủy
                            </button>
                            <button onClick={handleSubmitReview} disabled={submitting}>
                                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default MyDetailOrder;