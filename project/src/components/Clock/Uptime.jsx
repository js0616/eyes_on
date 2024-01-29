import React, { useEffect, useState } from 'react';

const Uptime = ({ stdTime }) => {
  const { y, m, d, hh, mm, ss } = stdTime;
  const [time, setTime] = useState({hh: '00', mm: '00', ss: '00'});
  const targetTime = new Date(`${y}-${m}-${d}T${hh}:${mm}:${ss}`).getTime();

  useEffect(() => {
    const intervalClock = setInterval(() => {
      const currentTime = new Date().getTime();
      const diffTime = (currentTime - targetTime) / 1000;

      setTime({
        hh: String(Math.round(diffTime / 3600)).padStart(2, '0'),
        mm: String(Math.round((diffTime % 3600) / 60)).padStart(2, '0'),
        ss: String(Math.round((diffTime % 3600) % 60)).padStart(2, '0'),
      });
    }, 1000);

    return () => {
      clearInterval(intervalClock);
    };
  }, [])

  return (
    <div className='uptime'>
      <div className='info'>
        <span className='timer'>{`${time.hh}:${time.mm}:${time.ss}`}</span>
      </div>
    </div>
  );
};

export default Uptime;