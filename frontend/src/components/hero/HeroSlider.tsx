import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import './HeroSlider.css';

const HeroSlider = () => {
  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      navigation={true}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      className="mySwiper"
      slidesPerView={1}
      loop={true}
      observer={true}
      observeParents={true}
    >
      <SwiperSlide>
        <div style={{
          backgroundImage: "url('/img/user-img/hero/banner1.png')",
          height: "500px",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }} />
      </SwiperSlide>

      <SwiperSlide>
        <div style={{
          backgroundImage: "url('/img/user-img/hero/banner2.png')",
          height: "500px",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }} />
      </SwiperSlide>
      <SwiperSlide>
        <div style={{
          backgroundImage: "url('/img/user-img/hero/banner3.png')",
          height: "500px",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }} />
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroSlider;