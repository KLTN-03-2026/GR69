import Hero from "../../components/hero/Hero";

function Contact() {
    const categories = [
        { name: "Bán chạy nhất", path: "/category/ban-chay-nhat" },
        { name: "Hải sản đông lạnh", path: "/category/hai-san-dong-lanh-moi" },
        { name: "Hải sản tươi sống", path: "/category/hai-san-tuoi-song" },
        { name: "Hải sản nhập khẩu", path: "/category/hai-san-nhap-khau" },
        { name: "Cá hồi", path: "/category/ca-hoi" },
        { name: "Hàu sữa", path: "/category/hau-sua-viet-nam-va-nhap-khau" },
        { name: "Ngao, sò, ốc", path: "/category/ngao-so-oc" },
        { name: "Cua, ghẹ", path: "/category/cua-ghe-tuoi-roi" },
        { name: "Tôm các loại", path: "/category/cac-loai-tom-ngon" },
        { name: "Mực", path: "/category/muc-tuoi-moi-ngay" },
    ];
    return (
        <>
            <Hero categories={categories} />
            <div>
                <div className="breadcrumb-gray">
                    <div className="container">
                        <div className="breadcrumb-inner">
                            <a href="index.html">Trang chủ</a> /
                            <span>Liên hệ</span>
                        </div>
                    </div>
                </div>
            </div>
            <section className="contact spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-6 text-center">
                            <div className="contact__widget">
                                <span className="icon_phone" />
                                <h4>Số điện thoại</h4>
                                <p>+0909 999 999</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 text-center">
                            <div className="contact__widget">
                                <span className="icon_pin_alt" />
                                <h4>Địa chỉ</h4>
                                <p>999 Nguyễn Tất Thành, Xuân Hà, Thanh Khê, Đà Nẵng</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 text-center">
                            <div className="contact__widget">
                                <span className="icon_clock_alt" />
                                <h4>Thời gian mở cửa</h4>
                                <p>10:00 sáng đến 23:00 tối</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 text-center">
                            <div className="contact__widget">
                                <span className="icon_mail_alt" />
                                <h4>Email</h4>
                                <p>fishmarket@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="map">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.865689172928!2d108.188135375198!3d16.072458039351265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142185601576105%3A0xd01ee2d93e59753a!2zOTk5IE5ndXnhu4VuIFThuqV0IFRow6BuaCwgWHXDom4gSMOgLCBUaGFuaCBLaMOqLCDEkMOgIE7hurVuZywgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1773753219687!5m2!1svi!2s" width={600} height={450} style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                <div className="map-inside">
                    <i className="icon_pin" />
                    <div className="inside-widget">
                        <h4>Đà Nẵng</h4>
                        <ul>
                            <li>SĐT: +090999999</li>
                            <li>Địa chỉ: 999 Nguyễn Tất Thành, Xuân Hà, Thanh Khê, Đà Nẵng</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Contact;