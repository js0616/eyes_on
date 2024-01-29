import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { facilityReducer } from './redux/reducers/facilitySlice';
import { logout, setUserInfo } from './redux/reducers/userSlice';
import Splash from './pages/Init/Splash';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import CCTVPage from './pages/CCTVPage/CCTVPage';
import LoginPage from './pages/LoginPage/LoginPage';
import AuthPage from './pages/AuthPage/AuthPage';
import JoinPage from './pages/JoinPage/JoinPage';
import VideoDetailPage from './pages/VideoDetailPage/VideoDetailPage';
import RealVideoDetailPage from './pages/VideoDetailPage/RealVideoDetailPage';
import AlarmArea from './components/Alarm/AlarmArea';
import Tutorial from './components/Tutorial/Tutorial';
import Cursor from './components/Cursor/Cursor';
import api from './utils/api';
import FullVideoPage from './pages/VideoDetailPage/FullVideoPage';

const App = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const theme = useSelector(state => state.theme);
  const facility = useSelector(state => state.facility);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  // get facility list
  const getFacilityList = async () => {
    try {
      const facilityList = await api.post('/facility/list');
      const floorRange = await api.post('/facility/floorRange');
      const floorList = await api.post('/facility/floorList', { facilityList: facilityList.data, floorRange: floorRange.data });

      dispatch(facilityReducer.setFacilityList(facilityList.data));
      dispatch(facilityReducer.setFloorRange(floorRange.data));
      dispatch(facilityReducer.setFloorList(floorList.data));

      // filtered list
      dispatch(facilityReducer.filteredAbnormalList(['위험', '경고']));
    } catch (error) {
      console.log(error);
    }
  };

  window.addEventListener('mousemove', e => {
    setPos({ x: e.clientX, y: e.clientY });
  });

  useEffect(() => {
    getFacilityList();
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === true) {
      // 로그인 상태가 true이면 Redux 상태 업데이트
      // 실제로는 사용자 정보 등을 함께 로드해야 할 수 있습니다.
      dispatch(setUserInfo({/* 사용자 정보 */}));
    } else {
      // localStorage에 로그인 상태가 없으면 로그아웃 상태로 설정
      dispatch(logout());
    }
  }, [dispatch]);

  return (
    <>
      {user.isSplash && <Splash />}
      <div className={`App ${theme.isDark ? 'dark' : ''}`}>
        {/* {user.isLoggedIn && <Header />} */}
        <Header />
        <main className='main dark_bg_02'>
          <Routes>
            {
              // user.isLoggedIn ?
              <>
                <Route path='/' element={<HomePage />} />
                <Route path='/cctv' element={<CCTVPage />} />
                <Route path='/video/:videoId' element={<VideoDetailPage />} />
                <Route path='/rvideo/0' element={<RealVideoDetailPage />} />
                <Route path='/fullvideo/:videoInfo' element={<FullVideoPage />} />
              </>
              // :<>
              //   <Route path='/' element={<LoginPage />} />
              //   <Route path='/auth' element={<AuthPage />} />
              //   <Route path='/join' element={<JoinPage />} />
              // </>
            }
          </Routes>
          {/* {user.isLoggedIn && <AlarmArea />} */}
          <AlarmArea />
          <Cursor pos={pos} />
        </main>
      </div>
    </>
  );
}

export default App;
