import api from '../../utils/api';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ms from '../../utils/matchedSituation';

const Detect = () => {
  const { videoId } = useParams();
  
      // t_facility 테이블 데이터 가져오기
      const [info_list, setInfoList] = useState([])
    
      useEffect(()=>{
        api.post('/obj_record/info', {videoId:videoId})
        .then(res=>{
          setInfoList(res.data.info_list[0])
        }).catch(err=>console.log(err))
      },[videoId])

  return (
    <div className='info_detect'>
        <div className={`detect ${ms(info_list.fac_situation)}_bg`}>
            <div className='d_name'>설비 온도</div>
            {/* <div className='d_data'>{info_list.fac_situation}</div> */}
            <div className='d_data'>50°C</div>
        </div>
        <div className={`detect ${ms(info_list.fac_situation)}_bg`}>
            <div className='d_name'>현재 상태</div>
            {/* <div className='d_data'>{info_list.fac_situation}</div> */}
            <div className='d_data'>{info_list.fac_situation}</div>
        </div>
    </div>
  )
}

export default Detect