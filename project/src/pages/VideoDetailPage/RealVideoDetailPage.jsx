import api from '../../utils/api';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import RealDetect from '../../components/Info/RealDetect';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import Clock from '../../components/Clock/Clock';
import { facilityReducer } from '../../redux/reducers/facilitySlice';
import Uptime from '../../components/Clock/Uptime';


ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const RealVideoDetailPage = () => {
    const dispatch = useDispatch()
    const facilityList= useSelector(state => state.facility.facilityList)
    const facility= useSelector(state => state.facility)
    // const { videoId } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('단기(20분)');
    const theme = useSelector(state => state.theme);

    // 받아올 온도 리스트
    const [temp_list, setTemplist] = useState([[0,0]]);
    // const temp_list = [[0,0]]
    // 길이?
    const [nowtempIndex, setNowtempIndex] = useState(0)
    // const nowtempIndex = (91)
    const [last_temp, setLasttemp] = useState(0)
    // const last_temp = (0)

    let temp_fa = 20

    // 함수 onTemp, onPredict 에 따라서 화면에 요청하는 path 변경
    // const [video_path, setVideopath] = useState('video')

    // 온도 요청 함수
    const onTemp = ()=> {
      // api.get('/obj_record/temp')
      // setVideopath('video')
      api.get('http://127.0.0.1:5000/flask/temp')
        .then(response => {
          
          setTemplist(response.data)
          setNowtempIndex(response.data.length)
          setLasttemp(response.data[response.data.length-1][1])

          console.log('temp data:',response.data,last_temp, nowtempIndex);

          dispatch(facilityReducer.setRVideoSituation('정상'));
          // console.log(response.data.length)
          // console.log(response.data[response.data.length-1][1])

          // api.post('/obj_record/normal').then(res => console.log(res)).catch(err => console.log('normal - err' ,err))

        })
        .catch(error => {
          console.error('데이터 가져오기 중 오류 발생:', error.message);
        });
    } 

    const onPredict = () => {
      // setVideopath('video/pre')
      api.get('http://127.0.0.1:5000/flask/predict')
        .then(response => {
          
          // setPrelist(response.data)
          setTemplist(response.data[0])
          setNowtempIndex(response.data[1])
          setLasttemp(response.data[0][response.data[1]-1][1])
          console.log('predict data:',response.data,last_temp, nowtempIndex);

          //  node - db 
          api.get('/obj_record/sms').then(response => {
            console.log('sms 확인',response.data)

            api.post('/facility/list')
            .then(res => {
              console.log('facility state update' , res )
              dispatch(facilityReducer.setFacilityList(res.data));
              dispatch(facilityReducer.setAbnormalList(res.data[0]))
              console.log(facility)
            })
            .catch(err => console.log(err))
              })
        })
        .catch(error => {
          console.error('데이터 가져오기 중 오류 발생:', error.message);
        });
    }

  
    // console.log(selectedOption.tit)
    const dropdownToggle = e => {
      e.preventDefault();
      setIsOpen(prev => !prev);
    };
    const selectOption = e => {
      e.preventDefault();
      setSelectedOption(e.target.value);
      setIsOpen(false);
    };

    // 온도값 요청 r - n - f - n - r 순서로 진행 예정
    // 1. temp_list, onTemp 만들고 2. useEffect 로 setInterval 사용
    // 3. router 연결 obj_record.js 

    useEffect(() => {
      onTemp()
      // onPredict()
      console.log('use Effect start')
    }, []);


    useEffect(()=>{

      const intervalId = setInterval(() => {
        console.log('useEffect 2',last_temp, nowtempIndex)
        //
        last_temp >= temp_fa ? onPredict() : onTemp()
      }, 10000); // 시간
  
      // 컴포넌트가 언마운트될 때 interval 정리
      return () => clearInterval(intervalId);
           
    },[nowtempIndex])
  
    // chart 그래프
    // datetime에서 시간만 가져오기
    // const datetime = obj_list.map(item=>item.obj_detection_time).toLocaleString()
    // const datetime1 = datetime.split(/\s|,/)
    // let only_time = datetime1.filter((element, index) => index % 2 !== 0);

    // 시간 배열 생성
    let time_array = temp_list?.map(item => item[0]);

    // 온도 배열 생성
    let temperature_array = temp_list?.map(item => item[1]);

    // 설비 상태
    let last_state = '정상'
    if (last_temp >= temp_fa){
      last_state = '경고'
    }
    else if (last_temp > 50){
      last_state = '위험'
    }
  
  // 단기 20분
  const labels = time_array;
  const data = {
    labels: labels,
    datasets: [{
        label: '전기 설비 온도',
        // data: obj_list.map(item=>item.obj_avg_temp),
        data: temperature_array,
        fill: true,
        tension: 0,
        borderWidth: 2,
        borderColor: (context) => {
          const value = context.chart.data.datasets[0].data[context.dataIndex];

          const value2 = context.dataIndex
          if (value2 < nowtempIndex){
            if (value > 50) {
              return 'red'; // 50 초과 시 빨간색
            } else if (value >= temp_fa) {
              return 'orange'; // 30 이상 시 오렌지색
            } else {
              return 'green'; // 그 외 기본 색상
            }
          }
          else{
            return 'gray';
          }
        },
        pointBorderWidth: 3,
        hoverBackgroundColor: "rgba(0, 99, 255, 0.427)",
        segment: {
          borderColor: context =>{
            const yval = context.p1.raw
            const xval = context.p1.parsed.x
            if (xval < nowtempIndex){
              if(yval > 50) { return 'red'} 
              else if (yval >= temp_fa ){ return 'orange' }
              else { return 'green' }
            }
            else{
              return 'gray'
            }
          },
          backgroundColor: context => {
            const yval = context.p1.raw
            const xval = context.p1.parsed.x
            if (xval < nowtempIndex){
              if(yval > 50) { return 'rgba(255, 99, 132, 0.2)'} 
              else if (yval >= temp_fa ){ return 'rgba(255, 206, 86, 0.2)' }
              else { return 'rgba(75, 192, 192, 0.2)' }
            }
            else{
              return 'rgba(157, 157, 157, 0.2)'
            }
          },
          pointBorderColor: context => {
            const yval = context.p1.raw
            const xval = context.p1.parsed.x
            if (xval < nowtempIndex){
              if(yval > 50) { return 'rgba(255, 99, 132, 0.2)'} 
              else if (yval >= temp_fa ){ return 'rgba(255, 206, 86, 0.2)' }
              else { return 'rgba(75, 192, 192, 0.2)' }
            }
            else{
              return 'rgba(157, 157, 157, 0.2)'
            }
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
          labels: labels,
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
    plugins:{
      legend:{
        display: false,
      }
    },
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
        borderColor: (context) => {
          const value = context.chart.data.datasets[0].data[context.dataIndex];
          if (value > 50) {
            return 'red'; // 50 초과 시 빨간색
          } else if (value >= 40) {
            return 'orange'; // 40 이상 시 오렌지색
          } else {
            return 'rgb(75, 192, 192)'; // 그 외 기본 색상
          }
        },
        tension: 0,
        backgroundColor: 'rgb(75, 192, 192, 0.1)',
        borderWidth: 2
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
        borderColor: (context) => {
          const value = context.chart.data.datasets[0].data[context.dataIndex];
          if (value > 50) {
            return 'red'; // 50 초과 시 빨간색
          } else if (value >= 40) {
            return 'orange'; // 40 이상 시 오렌지색
          } else {
            return 'rgb(75, 192, 192)'; // 그 외 기본 색상
          }
        },
        tension: 0,
        backgroundColor: 'rgb(75, 192, 192, 0.1)',
        borderWidth: 2
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
      console.log();
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
              {/* <video src="/videos/video_1_type_ir.mp4" autoPlay loop muted playsInline></video> */}
              {/* <img src={`http://127.0.0.1:5000/${video_path}`} width={'640px'} height={'480px'} ></img> */}
              <img src={`http://127.0.0.1:5000/video`} width={'640px'} height={'400px'} ></img>
            </div>
            {/* hd */}
            <div className='video_wrapper'>
              {/* <video src="/videos/video_1_type_hd.mp4" autoPlay loop muted playsInline></video> */}
              <img src="http://127.0.0.1:5000/video2" width={'640px'} height={'400px'} ></img>
            </div>
        </div>       
      {/* info */}
        <div className='info_container dark_bg_03'>
          <div className='info_wrapper1'>
              <p className='white_txt_01'>설비 담당자: {`${'이진솔'}`}</p>
          </div>
          <div className='info_wrapper2'>
            <h2 className='white_txt_01'>1F 작업실 배전반</h2>
            {/* <Detect></Detect> */}
            <RealDetect temp={last_temp} last_state = {last_state}/>
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
              <h4><span className={`chart_legend_circle cau_circle`}></span> 경고 : 20°C</h4>
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
  )
}

export default RealVideoDetailPage