function Dashboard() {
    return (
        <>
            <div>
                <div className="page-title">Tổng quan (Dashboard)</div>
                <div className="container-fluid px-4 mb-4" style={{ padding: '0 30px !important' }}>
                    <div className="row g-4">
                        <div className="col-xl-3 col-lg-6">
                            <div className="stat-card bg-blue">
                                <h6>Tổng Doanh Thu</h6>
                                <h2>0 đ</h2>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6">
                            <div className="stat-card bg-green">
                                <h6>Đơn hàng</h6>
                                <h2>0</h2>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6">
                            <div className="stat-card bg-yellow">
                                <h6>Sản phẩm</h6>
                                <h2>0</h2>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6">
                            <div className="stat-card bg-purple">
                                <h6>Khách hàng</h6>
                                <h2>0</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="activity-panel">
                    <h5>Chi tiết hoạt động</h5>
                    <ul>
                        <li>Đơn hàng chờ xử lý: <span className="val-black">0</span></li>
                        <li>Đơn hàng giao thành công: <span className="val-black">0</span></li>
                        <li>Sản phẩm hết hàng: <span className="val-red">0</span></li>
                        <li>Doanh thu hôm nay: <span className="val-black">0 đ</span></li>
                    </ul>
                </div>
            </div>
        </>
    );
}
export default Dashboard;