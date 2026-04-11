import { Link } from "react-router-dom";

function OrdersDetail() {
    return (
        <>
            <div className="container-fluid" style={{ padding: '30px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="m-0 fw-bold" style={{ color: '#111827' }}>Chi tiết đơn hàng <span className="text-primary">#382CD0</span></h4>
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
                                    <strong>Họ tên:</strong> minhhai
                                </div>
                                <div className="col-sm-6 mb-2">
                                    <strong>Số điện thoại:</strong> 0901 234 567
                                </div>
                                <div className="col-sm-6 mb-2">
                                    <strong>Email:</strong> lebin537@gmail.com
                                </div>
                                <div className="col-sm-6 mb-2">
                                    <strong>Địa chỉ giao:</strong> 123 Đường Bờ Biển, Quận 1, TP.HCM
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 border-start px-4">
                            <h5 className="fw-bold mb-3 text-secondary">Trạng thái đơn hàng</h5>
                            <div className="px-3 py-2 rounded border fw-bold text-center status-pending" style={{ fontSize: '0.95rem', display: 'inline-block', minWidth: '150px' }}>
                                CHỜ XỬ LÝ
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
                                <tr>
                                    <td className="text-center">
                                        <img src="img/feature-1.jpg" alt="Tôm Hùm" className="product-img-table" style={{ width: '50px', height: '50px' }} />
                                    </td>
                                    <td className="fw-bold">Tôm Hùm Alaska sống</td>
                                    <td>1.250.000 VNĐ</td>
                                    <td className="text-center">2</td>
                                    <td className="text-end fw-bold">2.500.000 VNĐ</td>
                                </tr>
                                <tr>
                                    <td className="text-center">
                                        <img src="img/feature-3.jpg" alt="Cua Cà Mau" className="product-img-table" style={{ width: '50px', height: '50px' }} />
                                    </td>
                                    <td className="fw-bold">Cua Gạch Cà Mau</td>
                                    <td>450.000 VNĐ</td>
                                    <td className="text-center">3</td>
                                    <td className="text-end fw-bold">1.350.000 VNĐ</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row mt-4 pt-2">
                        <div className="col-md-7 pe-lg-5">
                            <h5 className="text-secondary mb-3" style={{ fontWeight: 500 }}>Phương thức thanh toán:</h5>
                            <div className="mb-3">
                                <span className="border rounded px-3 py-2 bg-light fw-bold text-success">
                                    <i className="fa-solid fa-money-bill-wave me-2" /> Thanh toán khi nhận hàng (COD)
                                </span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <button className="btn btn-danger-custom" style={{backgroundColor: "red"}}>
                                    <i className="fa-solid fa-xmark me-1" /> Hủy đơn hàng
                                </button>
                            </div>
                        </div>
                        <div className="col-md-5 mt-4 mt-md-0">
                            <table className="table total-summary-table mb-0">
                                <tbody>
                                    <tr>
                                        <td className="fw-bold text-dark border-top-0">Tiền hàng:</td>
                                        <td className="text-end border-top-0">3.850.000 VNĐ</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold text-dark">Shipping:</td>
                                        <td className="text-end">50.000 VNĐ</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold text-dark">Tổng tiền:</td>
                                        <td className="text-end fw-bold" style={{ fontSize: '1.1rem' }}>3.900.000 VNĐ</td>
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