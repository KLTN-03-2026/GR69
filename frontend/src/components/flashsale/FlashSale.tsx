import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';
import './FlashSale.css';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

interface ProductImage {
    id: number;
    image_path: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    original_price?: number;
    unit?: string;
    weight?: string;
    images?: ProductImage[];
    is_new?: boolean;
}
type FlashSaleProps = {
    data: Product[];
};
const FlashSale = ({ data }: FlashSaleProps) => {
    const {addToCart}=useCart();
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
                    {data?.map((item) => {
                        return (
                            <SwiperSlide key={item.id}>
                                <div className="flash-sale-card">
                                    <Link to={`/product/${item.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                                        <div className="flash-sale-pic">
                                            <img
                                                src={`http://127.0.0.1:8000/${item.images?.[0]?.image_path}`}
                                                alt={item.name}
                                            />
                                            {item.is_new && <span className="badge-new">NEW</span>}
                                        </div>
                                    </Link>
                                    <div className="flash-sale-info">
                                        <div className="info-text">
                                            <Link to={`/product/${item.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                                                <h6>{item.name}</h6>
                                            </Link>
                                            <div className="price-box">
                                                <h5 className="price-sale">
                                                    {item.price.toLocaleString()}đ
                                                    <span className="unit">/ {item.weight} {item.unit}</span>
                                                </h5>

                                                {item.original_price && (
                                                    <span className="price-original">
                                                        {item.original_price.toLocaleString()}đ
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button className="add-to-cart-btn"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                addToCart(item, 1);
                                                toast.success("Đã thêm vào giỏ hàng");
                                            }}>
                                            <i className="fa fa-shopping-cart" />
                                        </button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
    );
};

export default FlashSale;