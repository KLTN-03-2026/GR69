import { Swiper, SwiperSlide } from 'swiper/react';
import {  Autoplay } from 'swiper/modules';

import 'swiper/css';

import './CategorySlider.css';

const CategorySlider = () => {
  return (
    <div className="categories-swiper-container">
      <Swiper
        modules={[Autoplay]}
        navigation
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        spaceBetween={20}
        slidesPerView={1}
        className="categories-swiper"
      >
        <SwiperSlide>
          <img src="/img/user-img/categories/cat-1.png" alt="" />
        </SwiperSlide>

        <SwiperSlide>
          <img src="/img/user-img/categories/cat-2.png" alt="" />
        </SwiperSlide>

        <SwiperSlide>
          <img src="/img/user-img/categories/cat-3.png" alt="" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default CategorySlider;