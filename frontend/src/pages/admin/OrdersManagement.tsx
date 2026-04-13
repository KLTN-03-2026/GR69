import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { adminOrderService } from "../../services/admin/adminOrderService";

interface Order {
    id: number;
    created_at: string;
    total_amount: number;
    status: string;
    user?: {
        name: string;
        email: string;
    };
}

function OrdersManagement() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        adminOrderService.getAll()
            .then(res => {
                setOrders(res.data.orders.data);
                console.log(res.data);
            })
            .catch(() => {
                toast.error("Lỗi tải đơn hàng");
            })
            .finally(() => setLoading(false));
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("vi-VN");
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case "pending":
                return { label: "Chờ xử lý", class: "status-warning" };
            case "processing":
                return { label: "Đang xử lý", class: "status-primary" };
            case "shipping":
                return { label: "Đang giao", class: "status-info" };
            case "delivered":
                return { label: "Đã giao", class: "status-success" };
            case "cancelled":
                return { label: "Đã hủy", class: "status-danger" };
            default:
                return { label: status, class: "" };
        }
    };

    const handleChangeStatus = (orderId: number, newStatus: string) => {
        adminOrderService.updateStatus(orderId, newStatus)
            .then(() => {
                toast.success("Cập nhật trạng thái thành công");
                fetchOrders();
            })
            .catch(() => {
                toast.error("Cập nhật thất bại");
            });
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="content-card">
            <div className="header-actions mb-4">
                <h4 className="page-title-custom m-0 text-dark fw-bold">
                    Quản lý Đơn hàng
                </h4>
            </div>

            <div className="table-responsive border border-light rounded">
                <table className="table table-custom align-middle mb-0 order-table">
                    <thead className="bg-light-gray">
                        <tr>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>
                                    <Link to={`/admin/order-detail/${order.id}`} className="order-id">
                                        #{order.id}
                                    </Link>
                                </td>

                                <td>
                                    <div className="customer-info">
                                        <span className="fw-bold text-dark">
                                            {order.user?.name || "N/A"}
                                        </span>
                                        <span className="customer-email">
                                            {order.user?.email || ""}
                                        </span>
                                    </div>
                                </td>

                                <td>{formatDate(order.created_at)}</td>

                                <td>
                                    {order.total_amount.toLocaleString()} đ
                                </td>

                                <td>
                                    <select
                                        className={`form-select ${getStatusInfo(order.status).class}`}
                                        value={order.status}
                                        onChange={(e) =>handleChangeStatus(order.id, e.target.value)}
                                    >
                                        <option value="pending">Chờ xử lý</option>
                                        <option value="processing">Đang xử lý</option>
                                        <option value="shipping">Đang giao</option>
                                        <option value="delivered">Đã giao</option>
                                        <option value="cancelled">Đã hủy</option>
                                    </select>
                                </td>

                                <td>
                                    <Link
                                        to={`/admin/order-detail/${order.id}`}
                                        className="btn btn-view-detail"
                                        style={{ backgroundColor: "#3b82f6",color: "#fff",fontSize: "13px"}}>
                                        Xem Chi Tiết
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {orders.length === 0 && (
                    <div className="p-3">Không có đơn hàng</div>
                )}
            </div>
        </div>
    );
}

export default OrdersManagement;