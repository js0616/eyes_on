import api from '../../utils/api';
import React, { Component, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import Detect from '../../components/Info/Detect';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler} from "chart.js";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import Uptime from '../../components/Clock/Uptime';
// import Obj_info from '../../components/Info/Obj_info';
// import Detection from '../../components/Info/Detection';

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const VideoDetailPage = () => {
  const { videoId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('단기(20분)');
  const theme = useSelector(state => state.theme);

  const dropdownToggle = e => {
    e.preventDefault();
    setIsOpen(prev => !prev);
  };
  const selectOption = e => {
    e.preventDefault();
    setSelectedOption(e.target.value);
    setIsOpen(false);
  };

  // t_facility 테이블 데이터 가져오기
  const [info_list, setInfoList] = useState([])
  
  useEffect(()=>{
    api.post('/obj_record/info', {videoId:videoId})
    .then(res=>{
      setInfoList(res.data.info_list[0])
    }).catch(err=>console.log(err))
  },[videoId])

  // t_obj_record 테이블 데이터 가져오기
  const [obj_list, setObjList] = useState([])

  useEffect(()=>{
    api.post('/obj_record/record_list', {videoId:videoId})
    .then(res=>{
      setObjList(res.data.obj_list)
    }).catch(err=>console.log(err))
  },[videoId])


  // chart 그래프
  // datetime에서 시간만 가져오기
  const datetime = obj_list.map(item=>item.obj_detection_time).toLocaleString()
  const datetime1 = datetime.split(/\s|,/)
  let only_time = datetime1.filter((element, index) => index % 2 !== 0);
  
  // 단기 20분
  const labels = only_time;
  const data = {
    labels: labels,
    datasets: [{
        data: obj_list.map(item=>item.obj_avg_temp),
        fill: true,
        tension: 0,
        borderWidth: 3,
        borderColor: (context) => {
          const value = context.chart.data.datasets[0].data[context.dataIndex];
          if (value > 50) {
            return 'red'; // 50 초과 시 빨간색
          } else if (value >= 40) {
            return 'orange'; // 40 이상 시 오렌지색
          } else {
            return 'green'; // 그 외 기본 색상
          }
        },
        pointBorderWidth: 6,
        hoverBackgroundColor: "rgba(0, 99, 255, 0.427)",
        segment: {
          borderColor: context =>{
            const yval = context.p1.raw
            if(yval > 50) { return 'red'} 
            else if (yval > 39 ){ return 'orange' }
            else { return 'green' }
          },
          backgroundColor: context => {
            const yval = context.p1.raw
            if(yval > 50) { return 'rgba(255, 99, 132, 0.2)'} 
            else if (yval > 39 ){ return 'rgba(255, 206, 86, 0.2)' }
            else { return 'rgba(75, 192, 192, 0.2)' }
          },
          pointBorderColor: context => {
            const yval = context.p1.raw
            if(yval > 50) { return 'rgba(255, 99, 132, 0.2)'} 
            else if (yval > 39 ){ return 'rgba(255, 206, 86, 0.2)' }
            else { return 'rgba(75, 192, 192, 0.2)' }
          }
        }     
      },
    ]
  };

  // 화이트 모드
  const options1 = {
    responsive: true,
    maintainAspectRatio :false,
    plugins:{
      legend:{
        display: false,
      }
    },
    scales: {
      x: {type: 'category',
          grid:{
            display: false, // x축 그리드 표시 여부
            lineWidth: 1.5, // 그리드 라인 너비
            drawBorder: false, // 축 주변에 그리드 테두리 표시 여부
          },
        },
      y: {type: 'linear',
          position: 'left',
          beginAtZero: true,
          grid:{
            display: true, // x축 그리드 표시 여부
            lineWidth: 1.5, // 그리드 라인 너비
            drawBorder: false, // 축 주변에 그리드 테두리 표시 여부
          },
        },
    },
  };
  // 다크 모드
  const options1_1 = {
    responsive: true,
    maintainAspectRatio :false,
    scales: {
      x: {type: 'category',
          labels: labels,
          ticks:{
            color: 'white'
          }
        },
      y: {type: 'linear',
          position: 'left',
          beginAtZero: true,
          grid:{
            color: '#a3a3a3',
            display: true, // x축 그리드 표시 여부
            lineWidth: 1.5, // 그리드 라인 너비
            drawBorder: true, // 축 주변에 그리드 테두리 표시 여부
          },
          ticks:{
            color: 'white'
          }
        },
    },
  };

  // 중기 1주일
  const labels2 = ['2023.11.13','2023.11.14','2023.11.15','2023.11.16','2023.11.17','2023.11.18','2023.11.19'];
  const data2 = {
    labels: labels2,
    datasets: [
      {
        label: '전기 설비 온도',
        data: [35,50,48,60,68,54,28],
        fill: true,
        tension: 0,
        borderWidth: 3,
        borderColor: (context) => {
          const value = context.chart.data.datasets[0].data[context.dataIndex];
          if (value > 50) {
            return 'red'; // 50 초과 시 빨간색
          } else if (value >= 40) {
            return 'orange'; // 40 이상 시 오렌지색
          } else {
            return 'green'; // 그 외 기본 색상
          }
        },
        pointBorderWidth: 6,
        hoverBackgroundColor: "rgba(0, 99, 255, 0.427)",
        segment: {
          borderColor: context =>{
            const yval = context.p1.raw
            if(yval > 50) { return 'red'} 
            else if (yval > 39 ){ return 'orange' }
            else { return 'green' }
          },
          backgroundColor: context => {
            const yval = context.p1.raw
            if(yval > 50) { return 'rgba(255, 99, 132, 0.2)'} 
            else if (yval > 39 ){ return 'rgba(255, 206, 86, 0.2)' }
            else { return 'rgba(75, 192, 192, 0.2)' }
          },
          pointBorderColor: context => {
            const yval = context.p1.raw
            if(yval > 50) { return 'rgba(255, 99, 132, 0.2)'} 
            else if (yval > 39 ){ return 'rgba(255, 206, 86, 0.2)' }
            else { return 'rgba(75, 192, 192, 0.2)' }
          }
        }
      },
    ],
  };

  // 화이트 모드
  const options2 = {
    responsive: true,
    maintainAspectRatio :false,
    scales: {
      x: {type: 'category',
          labels: labels2,
          grid:{
            display: false, // x축 그리드 표시 여부
            lineWidth: 1.5, // 그리드 라인 너비
            drawBorder: false, // 축 주변에 그리드 테두리 표시 여부
          },
        },
      y: {type: 'linear',
          position: 'left',
          beginAtZero: true,
          grid:{
            display: true, // x축 그리드 표시 여부
            lineWidth: 1.5, // 그리드 라인 너비
            drawBorder: false, // 축 주변에 그리드 테두리 표시 여부
          },
        },
    },
  };
  
  // 다크모드
  const options2_2 = {
    responsive: true,
    maintainAspectRatio :false,
    scales: {
      x: {type: 'category',
          labels: labels,
          ticks:{
            color: 'white'
          }
        },
      y: {type: 'linear',
          position: 'left',
          beginAtZero: true,
          grid:{
            color: '#a3a3a3',
            display: true, // x축 그리드 표시 여부
            lineWidth: 1.5, // 그리드 라인 너비
            drawBorder: true, // 축 주변에 그리드 테두리 표시 여부
          },
          ticks:{
            color: 'white'
          }
        },
    },
  };

  const labels3 = ['11.01','11.02','11.03','11.04','11.05','11.06','11.07','11.08','11.09','11.10',
                  '11.11','11.12','11.13','11.14','11.15','11.16','11.17','11.18','11.19','11.20',
                  '11.21','11.22','11.23','11.24','11.25','11.26','11.27','11.28','11.29','11.30'];
  const data3 = {
    labels: labels3,
    datasets: [
      {
        label: '전기 설비 온도',
        data: [25, 30, 50, 42, 48, 32, 58, 40, 32, 37,
               36, 35, 31, 27, 37, 32, 48, 45, 47, 46,
               42, 43, 60, 34, 38, 42, 36, 48, 42, 42],
        fill: true,
        tension: 0,
        borderWidth: 3,
        borderColor: (context) => {
          const value = context.chart.data.datasets[0].data[context.dataIndex];
          if (value > 50) {
            return 'red'; // 50 초과 시 빨간색
          } else if (value >= 40) {
            return 'orange'; // 40 이상 시 오렌지색
          } else {
            return 'green'; // 그 외 기본 색상
          }
        },
        pointBorderWidth: 6,
        hoverBackgroundColor: "rgba(0, 99, 255, 0.427)",
        segment: {
          borderColor: context =>{
            const yval = context.p1.raw
            if(yval > 50) { return 'red'} 
            else if (yval > 39 ){ return 'orange' }
            else { return 'green' }
          },
          backgroundColor: context => {
            const yval = context.p1.raw
            if(yval > 50) { return 'rgba(255, 99, 132, 0.2)'} 
            else if (yval > 39 ){ return 'rgba(255, 206, 86, 0.2)' }
            else { return 'rgba(75, 192, 192, 0.2)' }
          },
          pointBorderColor: context => {
            const yval = context.p1.raw
            if(yval > 50) { return 'rgba(255, 99, 132, 0.2)'} 
            else if (yval > 39 ){ return 'rgba(255, 206, 86, 0.2)' }
            else { return 'rgba(75, 192, 192, 0.2)' }
          }
        }  
      },
    ],
  };

  const options3 = {
    responsive: true,
    maintainAspectRatio :false,
    scales: {
      x: {type: 'category',
          labels: labels3,
          grid:{
            display: false, // x축 그리드 표시 여부
            lineWidth: 1.5, // 그리드 라인 너비
            drawBorder: false, // 축 주변에 그리드 테두리 표시 여부
          },
        },
      y: {type: 'linear',
          position: 'left',
          beginAtZero: true,
          grid:{
            display: true, // x축 그리드 표시 여부
            lineWidth: 1.5, // 그리드 라인 너비
            drawBorder: false, // 축 주변에 그리드 테두리 표시 여부
          },
        },
    },
  };
  
  const options3_3 = {
    responsive: true,
    maintainAspectRatio :false,
    scales: {
      x: {type: 'category',
          labels: labels,
          ticks:{
            color: 'white'
          }
        },
      y: {type: 'linear',
          position: 'left',
          beginAtZero: true,
          grid:{
            color: '#a3a3a3',
            display: true, // x축 그리드 표시 여부
            lineWidth: 1.5, // 그리드 라인 너비
            drawBorder: true, // 축 주변에 그리드 테두리 표시 여부
          },
          ticks:{
            color: 'white'
          }
        },
    },
  };
  // const bgcolor = {
  //   backgroundColor: 'rgba(0, 0, 0, 0)', // 바꾸고자 하는 배경색
  // };

  // 기간별로 그래프 변경
  const changeGraph = () =>{
    switch (selectedOption) {
      case '단기(20분)' :
        return <Line width={1400} data={data} options={theme.isDark ? options1_1 : options1}/>;
      case '중기(1주일)' :
        return <Line width={1400} data={data2} options={theme.isDark ? options2_2 : options2} />;
      case '장기(한 달)' :
        return <Line width={1400} data={data3} options={theme.isDark ? options3_3 : options3} />;
    }
  }

  return (
    <div className='video_detail_page'>
      <div className='detail_wrapper'>
      <div className='detail_top_container'>
        {/* video */}
        <div className='video_container dark_bg_03'>
            {/* ir */}
            <div className='video_wrapper'>
              <video src={`/videos/video_${info_list.fac_num}_type_ir.mp4`} autoPlay loop muted playsInline></video>
            </div>
            {/* hd */}
            <div className='video_wrapper'>
              <video src={`/videos/video_${info_list.fac_num}_type_hd.mp4`} autoPlay loop muted playsInline></video>
            </div>
        </div>
        {/* info */}
        <div className='info_container dark_bg_03'>
          <div className='info_wrapper1'>
              <p className='white_txt_01'>설비 담당자: {`${'이진솔'}`}</p>
          </div>
          <div className='info_wrapper2'>
            <h2 className='white_txt_01'>{info_list.company_floor+' '+info_list.fac_location+' '+info_list.fac_equipment_type}</h2>
            <Detect></Detect>
            <div className='info_wrapper3'>
              <div className='inside_txt white_txt_01'>
                <h4>내부 온도 : 20°C / 내부 습도 : 22%</h4>
              </div>
              <div className='inside_txt white_txt_01'>
                {/* uptime 에 기준시간을 전달하면 기준시간부터 현재시간까지 계산해서 가동시간을 표현 */}
                <h4>설비 가동 시간 : <Uptime stdTime={{y:'2023', m:'11', d:'25', hh:'11', mm:'10', ss: '00'}} /></h4>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* chart */}
        <div className='chart_container dark_bg_03'>
          <div className='dropdown_area'>
          <div className='graph_title'>
            <h2 className='white_txt_01'>배전반 상황 그래프</h2>
          </div>
            <div className='dropdown'>
              <button className='dropdown_tit' onClick={e => dropdownToggle(e)}>{selectedOption} <span className='icon'>{isOpen ? <BiSolidUpArrow /> : <BiSolidDownArrow /> }</span></button>
              <div className='dropdown_body' style={{display: isOpen ? 'flex' : 'none'}}>
                <input type='button' onClick={e => selectOption(e)} className='tab_btn' value={'단기(20분)'} />
                <input type='button' onClick={e => selectOption(e)} className='tab_btn' value={'중기(1주일)'} />
                <input type='button' onClick={e => selectOption(e)} className='tab_btn' value={'장기(한 달)'} />
              </div>
            </div>
          </div>
          <div className='obj_avg_txt white_txt_01'>
              <h4><span className={`chart_legend_circle nor_circle`}></span> 정상 </h4>
              <h4><span className={`chart_legend_circle cau_circle`}></span> 경고 : 40°C</h4>
              <h4><span className={`chart_legend_circle war_circle`}></span> 위험 : 50°C</h4>
              <h4><span className={`chart_legend_circle war_circle`} style={{backgroundColor:'gray'}}></span> 예측</h4>
          </div>
          <div className='graph_size'>
            <div className='graph_size1'>
              {changeGraph()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailPage;