import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { themeReducer } from '../../redux/reducers/themeSlice';
import { logout } from '../../redux/reducers/userSlice';
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import Tutorial from '../Tutorial/Tutorial' 
import Gnb from '../Gnb/Gnb';
import { FaRegQuestionCircle } from "react-icons/fa";
import { RiEye2Line } from "react-icons/ri";


const Header = () => {
  const theme = useSelector(state => state.theme);
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const dispatch = useDispatch();
  const pathname = useLocation().pathname;

  // modal state
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // modeal 
  const toggleTutorial = () => {
    setIsTutorialOpen(!isTutorialOpen);
  };

  const themeHandler = e => {
    e.preventDefault();

    dispatch(themeReducer.setIsDark());
  };

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <>
    <header className={`header white_txt_01 ${pathname !== '/' ? 'header_bg' : ''}`}>
      <div className='inner'>
        {/* left */}
        <div className="header_left">
          {/* logo */}
          <h1 className='logo white_txt_01'>
            <Link to='/'>EYES <span className='icon'><RiEye2Line /></span>N</Link>
          </h1>
          {/* gnb */}
          <Gnb pathname={pathname} />
        </div>
        {/* right */}
        <div className="header_right">
          {/* tutorial modal*/}
          <div className='tutor_panel'>
            <button className='btn_theme' onClick={toggleTutorial}><FaRegQuestionCircle /></button>
          </div>
          {/* btn theme */}
          <button onClick={e => themeHandler(e)} className='btn_theme'>
            { theme.isDark ? <BiSolidSun /> : <BiSolidMoon /> }
          </button>
          {/* <div className='user_panel'>
          {isLoggedIn ? (<button onClick={logoutHandler}>로그아웃</button>) : (<Link to='/login'>로그인</Link>)}
          </div> */}
        </div>
      </div>
    </header>
    {isTutorialOpen && (
        <div className="modal-backdrop" onClick={toggleTutorial}>
          <Tutorial onClose={toggleTutorial}/>
        </div>
      )}
    </>
  );
};

export default Header;