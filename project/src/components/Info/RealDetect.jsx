import api from '../../utils/api';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ms from '../../utils/matchedSituation';

const RealDetect = ({temp,last_state}) => {
  // const { videoId } = useParams();
  // console.log(videoId);
  
      // t_facility 테이블 데이터 가져오기
      // const [info_list, setInfoList] = useState([])
      // console.log('infolist',info_list);
    
  // useEffect(()=>{
  //   api.post('/obj_record/info', {videoId:videoId})
  //   .then(res=>{
  //     // console.log('record_data1', res.data.info_list[0])

  //     setInfoList(res.data.info_list[0])
  //   }).catch(err=>console.log(err))
  // },[])

  return (
    <div className='info_detect'>
        <div className={`detect ${ms(last_state)}_bg`}>
            <div className='d_name'>평균온도</div>
            {/* <div className='d_data'>{info_list.fac_situation}</div> */}
            <div className='d_data'>{temp}</div>
        </div>
        <div className={`detect ${ms(last_state)}_bg`}>
            <div className='d_name'>현재상태</div>
            {/* <div className='d_data'>{info_list.fac_situation}</div> */}
            <div className='d_data'>{last_state}</div>
        </div>
    </div>
  )
}

export default RealDetect