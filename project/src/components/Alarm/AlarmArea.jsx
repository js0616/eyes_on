import React, { useEffect, useState } from 'react'
import Alarm from './Alarm';
import { useSelector } from 'react-redux';
import { FaBell } from 'react-icons/fa';
import { MdClose } from "react-icons/md";

const AlarmArea = () => {
  const facility = useSelector(state => state.facility);
  const [isOpen, setIsOpen] = useState(false);
  const [situationLen, setSituationLen] = useState({ cau: 0, war: 0, nor: 0 });

  const alarmToggle = e => {
    e.preventDefault();
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    setSituationLen({
      cau: facility.abnormalList.filter(item => item.fac_situation === '경고').length,
      war: facility.abnormalList.filter(item => item.fac_situation === '위험').length,
      nor: 16 - facility.abnormalList.filter(item => ['경고', '위험'].includes(item.fac_situation)).length
    });
  }, [facility.abnormalList, facility]);


  return (
    <div className={`alarm_area ${facility.abnormalList.length !== 0 && 'war_bg'} ${isOpen ? 'open' : ''}`}>
      <div className={`alarm_info_area ${!isOpen && (facility.abnormalList.length !== 0) && 'war_ani'}`}>
        <button className='alarm_toggle' onClick={e => alarmToggle(e)}>{isOpen ? <MdClose /> : <FaBell />}</button>
        {!isOpen && (facility.abnormalList.length !== 0) && <span className='new_alarm'>{facility.abnormalList.length}</span>}
        <div className='alarm_info'>
          <div className='info'>
            <p><span className='badge war_bg'>위험</span> <span className='count'><strong>{`${situationLen.war}`}</strong>개</span></p>
            <p><span className='badge cau_bg'>경고</span> <span className='count'><strong>{`${situationLen.cau}`}</strong>개</span></p>
            <p><span className='badge nor_bg'>정상</span> <span className='count'><strong>{`${situationLen.nor}`}</strong>개</span></p>
          </div>
        </div>
      </div>
      <ul className='alarm_list border'>
        {
          facility.abnormalList.length !== 0 ?
          facility.abnormalList.map((fac, idx) => (
            <Alarm key={idx} fac={fac} />
          )) :
          <div className='alarm_clear'>감지된 위험이 없습니다</div>
        }
      </ul>
    </div>
  );
};

export default AlarmArea;