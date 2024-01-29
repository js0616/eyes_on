import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ms from '../../utils/matchedSituation';
import { BsCameraVideoFill } from "react-icons/bs";
import { useSelector } from 'react-redux';

const RealVideoPlayer = ({isAllHD }) => {
  const [isHD, setIsHD] = useState(true);
  const fac = useSelector(state => state.facility.facilityList[0])

  

  // each ir handler
  const irHandler = e => {
    e.preventDefault();
    setIsHD(false);
  };

  // each hd handler
  const hdHandler = e => {
    e.preventDefault();
    setIsHD(true);
  };

  useEffect(() => {
    setIsHD(isAllHD);
  }, [isAllHD]);

  return (
    <div className={`real_video_player ${ms(fac?.fac_situation)}_bd`}>
      <div className='inner'>
        {/* <iframe src='http://127.0.0.1:5000/' width={'100%'} height={'260px'}></iframe> */}
        <img src={isHD? 'http://127.0.0.1:5000/video2': 'http://127.0.0.1:5000/video3' } width={'100%'} height={'260px'} alt='video'></img>
        <Link to={'/rvideo/0'} className='real_video_link'>
          <p className={`real_video_tit ${ms(fac?.fac_situation)}_bg`}>
            <span className='icon'><BsCameraVideoFill /></span>
            01번 1F - 작업실 배전반
            {/* 0{fac.fac_num} {fac.company_floor} - {fac.location} {fac.equiqment_type} */}
          </p>
        </Link>
        <div className={`video_type_button_container ${isHD ? 'hd' : ''}`}>
          <button onClick={e => irHandler(e)} className='button_ir'>IR</button>
          <button onClick={e => hdHandler(e)} className='button_hd'>HD</button>
        </div>
      </div>
    </div>
  );
};

export default RealVideoPlayer;