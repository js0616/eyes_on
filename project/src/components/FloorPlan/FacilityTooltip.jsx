import React from 'react';
import { BsCameraVideoFill } from "react-icons/bs";

const FacilityTooltip = ({ fac }) => {
  const { fac_num, fac_equipment_type, fac_location, fac_situation, company_floor } = fac;
  return (
    <div className='facility_tooltip dark_bg_01'>
      <p className='fac_pos white_txt_01'><span className='icon'><BsCameraVideoFill /></span>{` ${String(fac_num).padStart(3, '0')}번 - ${company_floor} ${fac_location}`}</p>
      <p className='fac_info white_txt_01'>{`${fac_equipment_type}(${fac_situation})`}</p>
    </div>
  );
};

export default FacilityTooltip;