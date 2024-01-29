import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import RealVideoPlayer from '../../components/VideoPlayer/RealVideoPlayer';
import { facilityReducer } from '../../redux/reducers/facilitySlice';
import Clock from '../../components/Clock/Clock';
import Weather from '../../components/Weather/Weather';

const CCTVPage = () => {
  const dispatch = useDispatch();
  const facility = useSelector(state => state.facility);

  const [isAllHD, setIsAllHD] = useState(false);
  const [speed, setSpeed] = useState(0.5);

  const allVideoToggle = e => {
    setIsAllHD(prev => !prev);
  };

  return (
    <div className='cctv_page'>
      <div className='cctv_top_container dark_bg_03'>
          <button onClick={e => allVideoToggle(e)} className={`all_video_type_button ${isAllHD ? 'hd' : ''} dark_bg_06`}>
            <span className='toggle_thumb white_bg_01'>{isAllHD ? '전체 HD' : '전체 IR'}</span>
            <span className='toggle_thumb_oppo dark_bg_06 white_txt_03'>{isAllHD ? '전체 IR' : '전체 HD'}</span>
          </button>
        <Clock />
        <Weather />
      </div>
      {/* filtered */}
      {

        facility.abnormalList.length !== 0 &&
        <div className='cctv_wrapper dark_bg_03'>
          <h3 className='sc_tit white_txt_01'>위험 CCTV</h3>
          <div className='cctv_container'>
            {
              facility.abnormalList[0].fac_num === 1 && <RealVideoPlayer isAllHD={isAllHD} />
            }
            {
              facility.abnormalList.map((fac, idx) => {
                // return idx === 0 ?  :<VideoPlayer key={idx} fac={fac} isAllHD={isAllHD} />;
                return fac.fac_num !== 1 && <VideoPlayer key={idx} fac={fac} isAllHD={isAllHD} />
              })
            }
          </div>
        </div>
      }
      {/* all */}
      <div className='cctv_wrapper dark_bg_03'>
        <h3 className='sc_tit white_txt_01'>전체 CCTV</h3>
        <div className="cctv_container">
          {/* realvideo area start */}
          <RealVideoPlayer isAllHD={isAllHD} />
          {/* realvideo area end */}
          {
            facility.facilityList.map((fac, idx) => (
              idx > 0 && <VideoPlayer key={idx} fac={fac} isAllHD={isAllHD} />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default CCTVPage;