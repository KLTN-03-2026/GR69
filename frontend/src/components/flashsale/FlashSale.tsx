import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';
import './FlashSale.css';
import { Link } from 'react-router-dom';

type FlashSaleProps = {
    data: any[];
};
const FlashSale = ({ data }: FlashSaleProps) => {
    return (
        <section className="flash-sale-section">
            <div className="flash-sale-container">
                {/* Header */}
                <div className="flash-sale-header">
                    <h4>⚡ BAO RẺ, BAO TƯƠI </h4>
                    <Link to="/category/hai-san-tuoi-song" className="btn-view-all">Xem tất cả</Link>
                </div>

                {/* Swiper Slider */}
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={15}
                    slidesPerView={5}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        320: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 5 },
                    }}
                    className="flash-sale-slider"
                >
                    {data?.map((item: any) => {
                        return (
                            <SwiperSlide key={item.id}>
                                <Link to={`/product/${item.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                                    <div className="flash-sale-card">
                                        <div className="flash-sale-pic">
                                            <img
                                                src={`http://127.0.0.1:8000/${item.images?.[0]?.image_path}`}
                                                alt={item.name}
                                            />
                                            {item.isNew && <span className="badge-new">NEW</span>}
                                        </div>
                                        <div className="flash-sale-info">
                                            <div className="info-text">
                                                <h6>{item.name}</h6>
                                                <div className="price-box">
                                                    <h5 className="price-sale">
                                                        {item.price.toLocaleString()}đ
                                                        <span className="unit"> / {item.unit}</span>
                                                    </h5>

                                                    {item.original_price && (
                                                        <span className="price-original">
                                                            {item.original_price.toLocaleString()}đ
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button className="btn-cart">
                                                <i className="fa fa-shopping-cart" />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
    );
};

export default FlashSale;