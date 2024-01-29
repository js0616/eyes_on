import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ms from '../../utils/matchedSituation';
import crt from '../../utils/createRandomTemperature';
import { BsCameraVideoFill } from "react-icons/bs";
import { SlSizeFullscreen } from "react-icons/sl";

const VideoPlayer = ({ fac, isAllHD }) => {
  const { fac_num, fac_situation, fac_location, company_floor, fac_equipment_type } = fac;
  const [isHD, setIsHD] = useState(true);
  const videoRef = useRef(null);
  const navigate = useNavigate();

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

  const fullVideoHandler = () => {
    navigate(`/fullvideo/${fac_num}&${isHD ? 'hd' : 'ir'}`);
  };

  useEffect(() => {
    setIsHD(isAllHD);
  }, [isAllHD]);

  return (
    <div className={`video_player ${ms(fac_situation)}_bd`}>
      <div className='inner'>
        <Link to={`/video/${fac_num}`}>
          <video ref={videoRef} src={`/videos/video_${fac_num}_type_${isHD ? 'hd' : 'ir'}.mp4`} muted autoPlay playsInline loop className='video_cctv'></video>
          <div className='overlay'>
            <p className={`video_num ${ms(fac_situation)}_bg`}><span className='icon'><BsCameraVideoFill /></span> {`${String(fac_num).padStart(2, '0')}번 ${company_floor} - ${fac_location} ${fac_equipment_type}`}</p>
            <div className='temp_bar_area' style={{ display: isHD ? 'none' : 'block' }}>
              <span className='temp_max'>{crt(30, 1)}</span>
              <img src="/images/temp_bar.png" alt="온도범위" />
              <span className='temp_min'>{crt(30, 0)}</span>
            </div>
          </div>
        </Link>
        <div className={`video_type_button_container ${isHD ? 'hd' : ''}`}>
          <button onClick={e => irHandler(e)} className='button_ir'>IR</button>
          <button onClick={e => hdHandler(e)} className='button_hd'>HD</button>
        </div>
        <button onClick={fullVideoHandler} style={{display:'none', position:'absolute', left: 0, bottom: 0, color: '#fff'}}><SlSizeFullscreen /></button>
      </div>
    </div>
  );
};

export default VideoPlayer;