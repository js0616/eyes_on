import React, { useEffect, useRef, useState } from 'react';
import Logo from '../../components/Logo/Logo';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserInfo } from '../../redux/reducers/userSlice';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { MdCheck } from "react-icons/md";
import { SlClose } from "react-icons/sl";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const AuthPage = () => {
  const [formData, setFormData] = useState({userId: '', userPw: ''});
  const [isPwVisible, setIsPwVisible] = useState(false); // 비밀번호 가시성 상태
  const [loginMsg, setLoginMsg] = useState(''); // 로그인 성공, 실패 메시지

  const navigate = useNavigate();

  // dispatch
  const dispatch = useDispatch();

  // ref
  const idRef = useRef(null);
  const pwRef = useRef(null);

  // submit
  const submitHandler = (e) => {
    e.preventDefault(); 
    api.post('/user/login', formData).then(res => {
        if (res.data.success) {
          console.log('로그인 성공');
          const userInfo = { id: formData.userId };
          dispatch(setUserInfo(userInfo));
          sessionStorage.setItem('isLoggedIn', 'true'); 
          navigate('/')
        }else {
          setLoginMsg('아이디 또는 비밀번호를 잘못 입력하셨습니다.\n입력하신 내용을 다시 확인해주세요.');
        }
      })
      .catch(err => {
          console.log(err);
      });
  };

  // ID celar 함수
  const clearIcon = (field) => {
    setFormData({ ...formData, [field]: '' });
    idRef.current.focus()
  };

   // 비밀번호 가시성 토글 함수
   const toggleShowIcon = () => {
    setIsPwVisible(!isPwVisible);
    pwRef.current.selectionEnd = pwRef.current.value.length
    // pwRef.current.focus()
  };


  useEffect(() => {
    idRef.current.focus();
  }, []);

  return (
    <div className='login_page'>
      {/* form */}
      <form onSubmit={submitHandler} className='login_form'>
        <Logo />
        <div className='input_container'>
          {/* id */}
          <div className='input_wrap'>
            <label htmlFor="user_id" className='white_txt_01'>아이디</label>
            <div className='input-icon'>
              <input ref={idRef} id='user_id' className='dark_input' type="text" onChange={e => setFormData({...formData, userId: e.target.value})} value={formData.userId} required placeholder='아이디를 입력하세요' />
              {formData.userId && (<span className='clear_icon' onClick={() => clearIcon('userId')}><SlClose /></span>)}
            </div>
          </div>
          {/* pw */}
          <div className='input_wrap'>
            <label htmlFor="user_pw" className='white_txt_01'>비밀번호</label>
            <div className='input-icon'>
             <input ref={pwRef} id='user_pw' className='dark_input' type={isPwVisible ? "text" : "password"} onChange={e => setFormData({...formData, userPw: e.target.value})} required placeholder='비밀번호를 입력하세요' />
             <span className='show_icon' onClick={toggleShowIcon}>{isPwVisible ? <FaRegEye /> : <FaRegEyeSlash />}</span>
            </div>
            {/* login msg */}
            {loginMsg && <p style={{ color: 'red', whiteSpace: 'pre-line' }}>{loginMsg}</p>}
          </div>
          
          
          {/* remind */}
          <div className='remind_wrap'>
            <input type="checkbox" id='remind_user_info' />
            <label htmlFor="remind_user_info"><span><MdCheck /></span></label>
            <span>로그인 상태 유지</span>
          </div>
        </div>
        {/* button */}
        <div>
          <button className='button_login'>로그인</button>
        </div>
        {/*  */}
        <div className='login_group'>
          <div className='group_wrap'>
            <Link>아이디 찾기</Link>
            <Link>비밀번호 찾기</Link>
            <Link to='/join'>회원가입</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
