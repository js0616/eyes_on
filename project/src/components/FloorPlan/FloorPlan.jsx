import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ms from '../../utils/matchedSituation';
import { facilityReducer } from '../../redux/reducers/facilitySlice';
import FacilityTooltip from './FacilityTooltip';
import { BiSolidCctv } from "react-icons/bi";

const FloorPlan = ({ floor, floorName }) => {
  const facility = useSelector(state => state.facility);
  const dispatch = useDispatch();

  return (
    <div className='floor_plan'>
      <div className="img_container">
        <img src={`/images/floorplan_${floorName}.png`} alt={`평면도`}></img>
      </div>
      <div className="camera_facility_map">
        {
          floor?.map((fac, idx) => {
            return (
              <Link
                key={idx}
                to={fac.fac_num === 1 ? '/rvideo/0' : `/video/${fac.fac_num}`}
                // to={`/video/${fac.fac_num}`}
                className={`status ${ms(fac.fac_situation)}_bg`}
                style={{ left: fac.location_X, top: fac.location_Y }}
              >
                <span className='icon_cctv'><BiSolidCctv /></span>
                <FacilityTooltip fac={fac} />
              </Link>
            );
          })
        }
      </div>
      <div className="test-grid-row"></div>
      <div className="test-grid-col"></div>
    </div>
  );
};

export default FloorPlan;