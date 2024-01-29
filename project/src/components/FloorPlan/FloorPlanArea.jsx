import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import 'swiper/css';
import { RxHamburgerMenu } from "react-icons/rx";
import { MdClose } from "react-icons/md";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import FloorPlan from './FloorPlan';
import { facilityReducer } from '../../redux/reducers/facilitySlice';
import api from '../../utils/api';

const FloorPlanArea = () => {
  const dispatch = useDispatch();
  const swiperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const facility = useSelector(state => state.facility);
  const [floorList, setFloorList] = useState(facility.floorList);
  const floorRange = ['5F', '4F', '3F', '2F', '1F'];

  const floorPlanToggle = e => {
    e.preventDefault();
    setIsOpen(prev => !prev);
  };

  const goPrev = e => {
    e.preventDefault();
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const goNext = e => {
    e.preventDefault();
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  useEffect(() => {
    api
      .post('/facility/floorList', { facilityList: facility.facilityList, floorRange: floorRange })
      .then(res => setFloorList(res.data))
      .catch(err => console.log(`floorplan rerender err ${err}`));
  }, [facility.facilityList]);

  return (
    <div className='floor_plan_area glass' style={{ width: isOpen ? '460px' : '85px' }}>
      <button className='floor_plan_toggle white_txt_01' onClick={e => floorPlanToggle(e)}>{isOpen ? <MdClose /> : <RxHamburgerMenu />}</button>
      <Swiper
        ref={swiperRef}
        direction={'vertical'}
        slidesPerView={'auto'}
        spaceBetween={30}
        initialSlide={4}
        centeredSlides={true}
        loop={true}
        mousewheel={true}
        navigation={true}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return '<span class="' + className + '">' + (floorRange[index]) + '</span>';
          },
        }}
        keyboard={{
          enabled: true,
        }}
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={swiper => dispatch(facilityReducer.setCurrentFloor(floorRange[swiper.realIndex]))}
        className="floor_plan_swiper"
      >
        <SwiperSlide>
          <FloorPlan floor={floorList['5F']} floorName={'5F'} />
        </SwiperSlide>
        <SwiperSlide>
          <FloorPlan floor={floorList['4F']} floorName={'4F'} />
        </SwiperSlide>
        <SwiperSlide>
          <FloorPlan floor={floorList['3F']} floorName={'3F'} />
        </SwiperSlide>
        <SwiperSlide>
          <FloorPlan floor={floorList['2F']} floorName={'2F'} />
        </SwiperSlide>
        <SwiperSlide>
          <FloorPlan floor={floorList['1F']} floorName={'1F'} />
        </SwiperSlide>
      </Swiper>
      <button className="swiper-button swiper-button-prev white_txt_01" onClick={e => goPrev(e)}>
        <BiSolidUpArrow />
      </button>
      <button className="swiper-button swiper-button-next white_txt_01" onClick={e => goNext(e)}>
        <BiSolidDownArrow />
      </button>
    </div>
  );
};

export default FloorPlanArea;