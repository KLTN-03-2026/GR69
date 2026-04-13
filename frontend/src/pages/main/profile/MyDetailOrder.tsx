import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderService } from "../../../services/user/orderService";
import { toast } from "react-toastify";

interface OrderItem {
    id: number;
    product_name: string;
    price: number;
    quantity: number;
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

    return (
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
                                    <a href="#" className="btn-text-rate">
                                        Đánh giá
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MyDetailOrder;