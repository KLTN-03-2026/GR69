import { Link } from "react-router-dom";

function OrderSuccess() {
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="text-center checkout-box p-5" style={{ maxWidth: "500px", width: "100%" }}>
                
                <div style={{ fontSize: "70px", color: "#28a745" }}>
                    <i className="fa fa-check-circle"></i>
                </div>

                <h2 className="mt-3">Đặt hàng thành công!</h2>

                <p className="text-muted mt-2">
                    Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
                </p>

                <div className="mt-4">
                    <Link to="/" className="btn btn-outline-secondary me-2">
                        Tiếp tục mua sắm
                    </Link>

                    <Link to="/account/my-orders" className="btn btn-success">
                        Xem đơn hàng
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccess;