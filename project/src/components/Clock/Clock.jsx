import React, { useEffect, useState } from 'react';
import { FaRegClock } from "react-icons/fa6";

const Clock = () => {
  const [time, setTime] = useState({y: '0000', m: '00', d: '00', hh: '00', mm: '00', ss: '00'});

  useEffect(() => {
    const intervalClock = setInterval(() => {
      const date = new Date();
      setTime({
        y: String(date.getFullYear()),
        m: String(date.getMonth() + 1).padStart(2, '0'),
        d: String(date.getDate()).padStart(2, '0'),
        hh: String(date.getHours()).padStart(2, '0'),
        mm: String(date.getMinutes()).padStart(2, '0'),
        ss: String(date.getSeconds()).padStart(2, '0'),
      });
    }, 1000);

    return () => {
      clearInterval(intervalClock);
    };
  }, [])

  return (
    <div className='clock dark_bg_05'>
      <div className='info'>
        <span className='icon dark_bg_05'><FaRegClock /></span>
        <span className='timer'>{`${time.y}-${time.m}-${time.d} ${time.hh}:${time.mm}:${time.ss}`}</span>
      </div>
    </div>
  );
};

export default Clock;