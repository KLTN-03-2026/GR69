function MyOrders() {
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
                        <tr>
                            <td>#7</td>
                            <td>05/05/2025</td>
                            <td>
                                <span className="status-badge status-warning">Đã hủy</span>
                            </td>
                            <td>129.250 đ</td>
                            <td>
                                <a href="order-details.html" className="btn-view-detail">Xem chi tiết</a>
                            </td>
                        </tr>
                        <tr>
                            <td>#6</td>
                            <td>05/05/2025</td>
                            <td>
                                <span className="status-badge status-warning">Chờ xác nhận</span>
                            </td>
                            <td>105.000 đ</td>
                            <td>
                                <a href="order-details.html" className="btn-view-detail">Xem chi tiết</a>
                            </td>
                        </tr>
                        <tr>
                            <td>#5</td>
                            <td>03/05/2025</td>
                            <td>
                                <span className="status-badge status-primary">Đang xử lý</span>
                            </td>
                            <td>107.098 đ</td>
                            <td>
                                <a href="order-details.html" className="btn-view-detail">Xem chi tiết</a>
                            </td>
                        </tr>
                        <tr>
                            <td>#4</td>
                            <td>03/05/2025</td>
                            <td>
                                <span className="status-badge status-warning">Chờ xác nhận</span>
                            </td>
                            <td>473.642 đ</td>
                            <td>
                                <a href="order-details.html" className="btn-view-detail">Xem chi tiết</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
export default MyOrders;