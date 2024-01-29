import React from 'react';
import { TbTemperature } from "react-icons/tb";
import { TiLocationArrowOutline } from "react-icons/ti";
import { WiHumidity } from "react-icons/wi";

/* 날씨 */
import { TiWeatherSunny,TiWeatherCloudy, TiWeatherDownpour, TiWeatherSnow } from "react-icons/ti";
/*
맑음: TiWeatherSunny
구름: TiWeatherCloudy
비: TiWeatherDownpour
눈: TiWeatherSnow
*/

const Weather = () => {
  return (
    <div className='weather dark_bg_05'>
      {/* 날씨 */}
      <div className='info'>
        <span className='icon dark_bg_05'><TiWeatherCloudy /></span>
        <span className='txt'>구름</span>
      </div>
      {/* 온도 */}
      <div className='info'>
        <span className='icon dark_bg_05'><TbTemperature /></span>
        <span className='txt'>7 ℃</span>
      </div>
      {/* 습도 */}
      <div className='info'>
        <span className='icon dark_bg_05' style={{fontSize: '28px'}}><WiHumidity /></span>
        <span className='txt'>20%</span>
      </div>
      {/* 풍향 */}
      <div className='info'>
        <span className='icon dark_bg_05' style={{ fontSize: '26px' }}><TiLocationArrowOutline /></span>
        <span className='txt'>북서 3.2 m/s</span>
      </div>
    </div>
  );
};

export default Weather;