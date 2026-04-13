import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminOrderService } from "../../services/admin/adminOrderService";
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
    total_amount: number;
    shipping_fee: number;
    discount: number;
    status: string;
    payment_method: string;
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    user?: {
        name: string;
        email: string;
    };
    items: OrderItem[];
}
function OrdersDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        adminOrderService.getById(Number(id))
            .then(res => {
                setOrder(res.data.order);
            })
            .catch(() => {
                console.log("load failed");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("vi-VN");

    const getStatusInfo = (status: string) => {
        switch (status) {
            case "pending": return { label: "Chờ xử lý", class: "status-pending" };
            case "processing": return { label: "Đang xử lý", class: "status-primary" };
            case "shipping": return { label: "Đang giao", class: "status-info" };
            case "delivered": return { label: "Đã giao", class: "status-success" };
            case "cancelled": return { label: "Đã hủy", class: "status-danger" };
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
    if (!order) return <div>Không có đơn hàng</div>;

    const status = getStatusInfo(order.status);
    const subtotal = order.total_amount - order.shipping_fee + (order.discount || 0);

    const handleCancelOrder = () => {
        if (!order) return;

        if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;

        adminOrderService.updateStatus(order.id, "cancelled")
            .then(() => {
                toast.success("Đã hủy đơn hàng");
                setOrder({ ...order, status: "cancelled" });
            })
            .catch(() => {
                toast.error("Hủy đơn thất bại");
            });
    };
    return (
        <>
            <div className="container-fluid" style={{ padding: '30px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="m-0 fw-bold" style={{ color: '#111827' }}>Chi tiết đơn hàng <span className="text-primary">#{order.id}</span></h4>
                    <Link to="/admin/orders-management" className="btn btn-outline-secondary shadow-sm">
                        <i className="fa-solid fa-arrow-left me-1" /> Quay lại danh sách
                    </Link>
                </div>
                <div className="content-card m-0 p-4">
                    <div className="row mb-4 pb-4 border-bottom">
                        <div className="col-md-8">
                            <h5 className="fw-bold mb-3 text-secondary">Thông tin khách hàng</h5>
                            <div className="row text-dark">
                                <div className="col-sm-6 mb-2">
                                    <strong>Họ tên:</strong> {order.shipping_name}
                                </div>
                                <div className="col-sm-6 mb-2">
                                    <strong>Số điện thoại:</strong> {order.shipping_phone}
                                </div>
                                <div className="col-sm-6 mb-2">
                                    <strong>Email:</strong> {order.user?.email || "N/A"}
                                </div>
                                <div className="col-sm-6 mb-2">
                                    <strong>Địa chỉ giao:</strong> {order.shipping_address}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 border-start px-4">
                            <h5 className="fw-bold mb-3 text-secondary">Trạng thái đơn hàng</h5>
                            <div className={`px-3 py-2 rounded border fw-bold text-center status-badge ${status.class}`}>
                                {status.label}
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive mb-4">
                        <table className="table table-bordered table-hover align-middle mb-0 data-table-custom">
                            <thead className="bg-light">
                                <tr>
                                    <th style={{ width: "10%" }} className="text-center">Ảnh</th>
                                    <th style={{ width: "35%" }}>Sản phẩm</th>
                                    <th style={{ width: "20%" }}>Giá</th>
                                    <th style={{ width: "15%" }} className="text-center">Số lượng</th>
                                    <th style={{ width: "20%" }} className="text-end">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map(item => {
                                    const image = item.product?.images?.[0]?.image_path || "default.jpg";
                                    return (
                                        <tr>
                                            <td className="text-center">
                                                <img
                                                    src={`http://127.0.0.1:8000/${image}`}
                                                    style={{ width: 50 }}
                                                />
                                            </td>
                                            <td className="fw-bold">{item.product_name}</td>
                                            <td>{item.price.toLocaleString()}đ</td>
                                            <td className="text-center">{item.quantity}</td>
                                            <td className="text-end fw-bold">{(item.price * item.quantity).toLocaleString()}đ</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="row mt-4 pt-2">
                        <div className="col-md-7 pe-lg-5">
                            <h5 className="text-secondary mb-3" style={{ fontWeight: 500 }}>Phương thức thanh toán:</h5>
                            <div className="mb-3">
                                <span className="border rounded px-3 py-2 bg-light fw-bold text-success">
                                    <i className="fa-solid fa-money-bill-wave me-2" /> {getPayment(order.payment_method)}
                                </span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                {order.status === "pending" && (
                                    <button
                                        className="btn btn-danger-custom"
                                        style={{ backgroundColor: "red" }}
                                        onClick={handleCancelOrder}
                                    >
                                        <i className="fa-solid fa-xmark me-1" /> Hủy đơn hàng
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-md-5 mt-4 mt-md-0">
                            <table className="table total-summary-table mb-0">
                                <tbody>
                                    <tr>
                                        <td className="fw-bold text-dark border-top-0">Tiền hàng:</td>
                                        <td className="text-end border-top-0">{subtotal.toLocaleString()}đ</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold text-dark">Shipping:</td>
                                        <td className="text-end">{order.shipping_fee}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold text-dark">Tổng tiền:</td>
                                        <td className="text-end fw-bold" style={{ fontSize: '1.1rem' }}>{order.total_amount.toLocaleString()} đ</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default OrdersDetail;