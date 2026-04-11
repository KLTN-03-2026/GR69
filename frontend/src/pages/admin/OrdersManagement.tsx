import { Link } from "react-router-dom";

function OrdersManagement() {
    return (
        <>
            <div className="content-card">
                <div className="header-actions mb-4">
                    <h4 className="page-title-custom m-0 text-dark fw-bold">Quản lý Đơn hàng</h4>
                </div>
                <div className="table-responsive border border-light rounded">
                    <table className="table table-custom align-middle mb-0 order-table">
                        <thead className="bg-light-gray">
                            <tr>
                                <th style={{ width: "12%" }}>Mã đơn</th>
                                <th style={{ width: "22%" }}>Khách hàng</th>
                                <th style={{ width: "15%" }}>Ngày đặt</th>
                                <th style={{ width: "18%" }}>Tổng tiền</th>
                                <th style={{ width: "18%" }}>Trạng thái</th>
                                <th style={{ width: "15%" }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><Link to="/admin/order-detail" className="order-id">#382CD0</Link></td>
                                <td>
                                    <div className="customer-info">
                                        <span className="fw-bold text-dark">minhhai</span>
                                        <span className="customer-email">lebin537@gmail.com</span>
                                    </div>
                                </td>
                                <td className="order-date">21/3/2026</td>
                                <td className="order-total">80,000,000 đ</td>
                                <td>
                                    <select className="form-select status-select status-pending" style={{fontSize: "14px"}}>
                                        <option selected>Chờ xử lý</option>
                                        <option>Đang xử lý</option>
                                        <option>Đang giao</option>
                                        <option>Đã giao</option>
                                        <option>Đã hủy</option>
                                    </select>
                                </td>
                                <td>
                                    <Link to="/admin/order-detail" className="btn btn-view-detail text-decoration-none d-inline-block" style={{backgroundColor: "#3b82f6", fontSize: "13px", color: "#fff"}}>Xem Chi Tiết</Link>
                                </td>
                            </tr>
                            <tr>
                                <td><Link to="/admin/order-detail" className="order-id">#A9651E</Link></td>
                                <td>
                                    <div className="customer-info">
                                        <span className="fw-bold text-dark">quocnhatst2</span>
                                        <span className="customer-email">nnhat425@gmail.com</span>
                                    </div>
                                </td>
                                <td className="order-date">20/3/2026</td>
                                <td className="order-total">2,000 đ</td>
                                <td>
                                    <select className="form-select status-select status-pending" style={{fontSize: "14px"}}>
                                        <option selected>Chờ xử lý</option>
                                        <option>Đang xử lý</option>
                                        <option>Đang giao</option>
                                        <option>Đã giao</option>
                                        <option>Đã hủy</option>
                                    </select>
                                </td>
                                <td>
                                    <Link to="/admin/order-detail" className="btn btn-view-detail text-decoration-none d-inline-block" style={{backgroundColor: "#3b82f6", fontSize: "13px", color: "#fff"}}>Xem Chi Tiết</Link>
                                </td>
                            </tr>
                            <tr>
                                <td><Link to="/admin/order-detail" className="order-id">#8FAF85</Link></td>
                                <td>
                                    <div className="customer-info">
                                        <span className="fw-bold text-dark">quocnhatst2</span>
                                        <span className="customer-email">nnhat425@gmail.com</span>
                                    </div>
                                </td>
                                <td className="order-date">20/3/2026</td>
                                <td className="order-total">2,000 đ</td>
                                <td>
                                    <select className="form-select status-select status-pending" style={{fontSize: "14px"}}>
                                        <option selected>Chờ xử lý</option>
                                        <option>Đang xử lý</option>
                                        <option>Đang giao</option>
                                        <option>Đã giao</option>
                                        <option>Đã hủy</option>
                                    </select>
                                </td>
                                <td>
                                    <Link to="/admin/order-detail" className="btn btn-view-detail text-decoration-none d-inline-block" style={{backgroundColor: "#3b82f6", fontSize: "13px", color: "#fff"}}>Xem Chi Tiết</Link>
                                </td>
                            </tr>
                            <tr>
                                <td><Link to="/admin/order-detail" className="order-id">#1F23F8</Link></td>
                                <td>
                                    <div className="customer-info">
                                        <span className="fw-bold text-dark">nnhat426</span>
                                        <span className="customer-email">nnhat426@gmail.com</span>
                                    </div>
                                </td>
                                <td className="order-date">26/12/2025</td>
                                <td className="order-total">20,000 đ</td>
                                <td>
                                    <select className="form-select status-select status-pending" style={{fontSize: "14px"}}>
                                        <option selected>Chờ xử lý</option>
                                        <option>Đang xử lý</option>
                                        <option>Đang giao</option>
                                        <option>Đã giao</option>
                                        <option>Đã hủy</option>
                                    </select>
                                </td>
                                <td>
                                    <Link to="/admin/order-detail" className="btn btn-view-detail text-decoration-none d-inline-block" style={{backgroundColor: "#3b82f6", fontSize: "13px", color: "#fff"}}>Xem Chi Tiết</Link>
                                </td>
                            </tr>
                            <tr>
                                <td><Link to="/admin/order-detail" className="order-id">#1F1FB0</Link></td>
                                <td>
                                    <div className="customer-info">
                                        <span className="fw-bold text-dark">nnhat426</span>
                                        <span className="customer-email">nnhat426@gmail.com</span>
                                    </div>
                                </td>
                                <td className="order-date">26/12/2025</td>
                                <td className="order-total">2,000 đ</td>
                                <td>
                                    <select className="form-select status-select status-pending" style={{fontSize: "14px"}}>
                                        <option>Chờ xử lý</option>
                                        <option>Đang xử lý</option>
                                        <option selected>Đang giao</option>
                                        <option>Đã giao</option>
                                        <option>Đã hủy</option>
                                    </select>
                                </td>
                                <td>
                                    <Link to="/admin/order-detail" className="btn btn-view-detail text-decoration-none d-inline-block" style={{backgroundColor: "#3b82f6", fontSize: "13px", color: "#fff"}}>Xem Chi Tiết</Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
export default OrdersManagement;