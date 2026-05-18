function ShippingPolicy() {
    return (
        <div className="shipping-policy-page">
            <div className="shipping-hero d-flex align-items-center justify-content-center text-center">
                <div>
                    <h1>Chính sách giao hàng</h1>
                    <p>Giao nhanh - Đúng hẹn - Đảm bảo chất lượng hải sản tươi sống</p>
                </div>
            </div>

            <div className="container py-5">
                <div className="text-center mb-5">
                    <h2>Thông tin giao hàng</h2>
                    <p className="text-muted">
                        FISHMARKET cam kết giao hàng nhanh chóng, đảm bảo hải sản luôn tươi ngon
                        khi đến tay khách hàng.
                    </p>
                </div>

                <div className="row g-4 mb-5">

                    <div className="col-md-4">
                        <div className="policy-box text-center">
                            <i className="fa-solid fa-truck-fast policy-icon text-success"></i>
                            <h5>Giao hàng nhanh</h5>
                            <p>
                                Đơn hàng nội thành được giao trong vòng 2 - 4 giờ
                                sau khi xác nhận.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="policy-box text-center">
                            <i className="fa-solid fa-snowflake policy-icon text-info"></i>
                            <h5>Bảo quản lạnh</h5>
                            <p>
                                Hải sản được đóng gói kỹ và bảo quản lạnh
                                trong suốt quá trình vận chuyển.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="policy-box text-center">
                            <i className="fa-solid fa-shield-halved policy-icon text-primary"></i>
                            <h5>Đảm bảo chất lượng</h5>
                            <p>
                                Hỗ trợ đổi trả nếu sản phẩm không đúng
                                chất lượng cam kết.
                            </p>
                        </div>
                    </div>

                </div>

                <div className="shipping-info-box mb-5">
                    <h3 className="mb-4">📦 Quy định giao hàng</h3>
                    <div className="shipping-item">
                        <h5>
                            <i className="fa-solid fa-location-dot me-2 text-danger"></i>
                            Khu vực giao hàng
                        </h5>
                        <p>
                            Hỗ trợ giao hàng tại TP.Đà Nẵng và các khu vực lân cận.
                            Một số tỉnh thành sẽ được vận chuyển qua đối tác logistics.
                        </p>
                    </div>

                    <div className="shipping-item">
                        <h5>
                            <i className="fa-solid fa-clock me-2 text-warning"></i>
                            Thời gian giao hàng
                        </h5>
                        <p>
                            Thời gian giao từ 8:00 - 21:00 mỗi ngày.
                            Đơn đặt sau 20:00 sẽ được xử lý vào ngày hôm sau.
                        </p>
                    </div>

                    <div className="shipping-item">
                        <h5>
                            <i className="fa-solid fa-money-bill-wave me-2 text-success"></i>
                            Phí vận chuyển
                        </h5>
                        <p>
                            Miễn phí giao hàng cho đơn từ 300.000đ.
                            Đơn dưới mức này sẽ áp dụng phí theo khoảng cách.
                        </p>
                    </div>

                    <div className="shipping-item">
                        <h5>
                            <i className="fa-solid fa-box-open me-2 text-primary"></i>
                            Kiểm tra hàng
                        </h5>
                        <p>
                            Khách hàng được kiểm tra tình trạng sản phẩm trước khi thanh toán.
                        </p>
                    </div>
                </div>

                <div className="support-box text-center">
                    <h3>📞 Hỗ trợ giao hàng</h3>
                    <p>
                        Nếu có bất kỳ vấn đề nào liên quan đến vận chuyển,
                        vui lòng liên hệ đội ngũ hỗ trợ của FISHMARKET.
                    </p>
                    <div className="support-contact">
                        <p>
                            <i className="fa-solid fa-phone"></i> 0909 999 999
                        </p>
                        <p>
                            <i className="fa-solid fa-envelope"></i> fishmarket@gmail.com
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ShippingPolicy;