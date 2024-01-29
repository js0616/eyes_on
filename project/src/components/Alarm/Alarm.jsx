import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { IoWarning } from "react-icons/io5";
import ms from '../../utils/matchedSituation';

const Alarm = ({ fac }) => {
  const navigate = useNavigate();
  const { fac_num, fac_situation, fac_location, company_floor, fac_equipment_type } = fac;

  return (
    <li className={`alarm ${ms(fac_situation)}_bg`}>
      <div className='icon_area'>
        <IoWarning />
      </div>
      <div className='content'>
        <p className='info'>{company_floor} - {`${fac_location} ${fac_equipment_type}(${fac_situation})`}</p>
        <div className='button_group'>
          <button className={`btn gotoBtn`} type='button' onClick={() => navigate(`/video/${fac_num}`)}>페이지로 이동</button>
        </div>
      </div>
    </li>
  );
};

export default Alarm;