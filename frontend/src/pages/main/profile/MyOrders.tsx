import { useEffect, useState } from "react";
import { orderService } from "../../../services/user/orderService";
import { Link } from "react-router-dom";

interface Order {
    id: number;
    created_at: string;
    status: string;
    total_amount: number;
}

function MyOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        orderService.getAll()
            .then(res => {
                setOrders(res.data.orders);
                console.log(res.data.orders);
            })
            .catch(() => {
                console.log("load orders failed");
            })
            .finally(() => setLoading(false));
    }, []);


    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN");
    };


    const getStatus = (status: string) => {
        switch (status) {
            case "pending":
                return { label: "Chờ xác nhận", className: "status-warning" };
            case "processing":
                return { label: "Đang xử lý", className: "status-primary" };
            case "shipping":
                return { label: "Đang giao", className: "status-info" };
            case "delivered":
                return { label: "Đã giao", className: "status-success" };
            case "cancelled":
                return { label: "Đã hủy", className: "status-danger" };
            default:
                return { label: status, className: "" };
        }
    };
    return (
        <>
            <div className="order-table-container table-responsive">
                <table className="table order-table">
                    <thead>
                        <tr>
                            <th>Đơn hàng</th>
                            <th>Ngày đặt</th>
                            <th>Trạng thái</th>
                            <th>Tổng tiền</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    Đang tải đơn hàng...
                                </td>
                            </tr>
                        )}

                        {!loading && orders.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    Bạn chưa có đơn hàng nào
                                </td>
                            </tr>
                        )}

                        {orders.map(order => {
                            const status = getStatus(order.status);
                            return (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{formatDate(order.created_at)}</td>
                                    <td>
                                        <span className={`status-badge ${status.className}`}>{status.label}</span>
                                    </td>
                                    <td>{order.total_amount.toLocaleString()}đ</td>
                                    <td>
                                        <Link to={`/account/order-detail/${order.id}`} className="btn-view-detail">Xem chi tiết</Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}
export default MyOrders;