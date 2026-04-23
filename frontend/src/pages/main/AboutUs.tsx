function AboutUs() {
    return (
        <div className="about-page">

            {/* HERO */}
            <div className="about-hero text-white d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <h1>FISHMARKET</h1>
                    <p>Hải sản tươi sống - Giao nhanh mỗi ngày</p>
                </div>
            </div>

            <div className="container py-5">

                {/* INTRO */}
                <div className="text-center mb-5">
                    <h2>Về chúng tôi</h2>
                    <p>
                        FISHMARKET cung cấp hải sản tươi sống chất lượng cao,
                        giao nhanh và đảm bảo an toàn thực phẩm.
                    </p>
                </div>

                {/* FEATURES */}
                <div className="row text-center mb-5">
                    <div className="col-md-3">
                        <i className="fa-solid fa-fish fa-2x mb-3 text-primary"></i>
                        <h5>Tươi 100%</h5>
                        <p>Hải sản mỗi ngày</p>
                    </div>

                    <div className="col-md-3">
                        <i className="fa-solid fa-truck-fast fa-2x mb-3 text-success"></i>
                        <h5>Giao nhanh</h5>
                        <p>Trong ngày</p>
                    </div>

                    <div className="col-md-3">
                        <i className="fa-solid fa-shield-halved fa-2x mb-3 text-warning"></i>
                        <h5>An toàn</h5>
                        <p>Đảm bảo vệ sinh</p>
                    </div>

                    <div className="col-md-3">
                        <i className="fa-solid fa-headset fa-2x mb-3 text-danger"></i>
                        <h5>Hỗ trợ 24/7</h5>
                        <p>Luôn sẵn sàng</p>
                    </div>
                </div>

                {/* STATS */}
                <div className="row text-center stats-box mb-5">
                    <div className="col-md-3">
                        <h3>10K+</h3>
                        <p>Khách hàng</p>
                    </div>
                    <div className="col-md-3">
                        <h3>500+</h3>
                        <p>Sản phẩm</p>
                    </div>
                    <div className="col-md-3">
                        <h3>5+</h3>
                        <p>Năm kinh nghiệm</p>
                    </div>
                    <div className="col-md-3">
                        <h3>99%</h3>
                        <p>Hài lòng</p>
                    </div>
                </div>

                {/* MISSION */}
                {/* MISSION - UPGRADED */}
                <div className="mission-section mb-5">
                    <div className="text-center mb-4">
                        <h2>Sứ mệnh & Tầm nhìn</h2>
                        <p>Chúng tôi không chỉ bán hải sản, mà còn mang đến trải nghiệm tốt nhất cho khách hàng</p>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-md-6 mb-3">
                            <img
                                src="img/user-img/about-us-1.jpg"
                                className="mission-img shadow"
                                alt="mission"
                            />
                        </div>

                        <div className="col-md-6">
                            <div className="mission-box mb-3">
                                <h5>
                                    <i className="fa-solid fa-bullseye me-2 text-success"></i>
                                    Sứ mệnh
                                </h5>
                                <p>
                                    Cung cấp hải sản tươi sống, an toàn và chất lượng cao đến mọi gia đình Việt,
                                    giúp khách hàng yên tâm trong từng bữa ăn.
                                </p>
                            </div>

                            <div className="mission-box mb-3">
                                <h5>
                                    <i className="fa-solid fa-rocket me-2 text-primary"></i>
                                    Tầm nhìn
                                </h5>
                                <p>
                                    Trở thành nền tảng cung cấp hải sản trực tuyến hàng đầu Việt Nam,
                                    với hệ thống giao hàng nhanh và dịch vụ chuyên nghiệp.
                                </p>
                            </div>

                            <div className="mission-box">
                                <h5>
                                    <i className="fa-solid fa-gem me-2 text-warning"></i>
                                    Giá trị cốt lõi
                                </h5>
                                <ul>
                                    <li>✔ Chất lượng đặt lên hàng đầu</li>
                                    <li>✔ Khách hàng là trung tâm</li>
                                    <li>✔ Minh bạch và uy tín</li>
                                    <li>✔ Cải tiến không ngừng</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="contact-section text-center mt-5">
                    <h2 className="mb-3">Liên hệ với chúng tôi</h2>
                    <p className="mb-4">
                        Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với FISHMARKET
                    </p>

                    <div className="row justify-content-center">
                        <div className="col-md-3 mb-3">
                            <div className="contact-box">
                                <i className="fa-solid fa-location-dot contact-icon text-danger"></i>
                                <h6>Địa chỉ</h6>
                                <p>Đà Nẵng</p>
                            </div>
                        </div>

                        <div className="col-md-3 mb-3">
                            <div className="contact-box">
                                <i className="fa-solid fa-phone contact-icon text-success"></i>
                                <h6>Điện thoại</h6>
                                <p>0909 999 999</p>
                            </div>
                        </div>

                        <div className="col-md-3 mb-3">
                            <div className="contact-box">
                                <i className="fa-solid fa-envelope contact-icon text-primary"></i>
                                <h6>Email</h6>
                                <p>fishmarket@gmail.com</p>
                            </div>
                        </div>

                        <div className="col-md-3 mb-3">
                            <div className="contact-box">
                                <i className="fa-solid fa-clock contact-icon text-warning"></i>
                                <h6>Giờ làm việc</h6>
                                <p>08:00 - 22:00</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AboutUs;