import React, { useRef, useState } from 'react';
import Logo from '../../components/Logo/Logo';
import api from '../../utils/api';
import { FaCheck } from "react-icons/fa";
import { TbLock, TbLockCheck } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

const JoinPage = () => {
  // form data state
  const [formData, setFormData] = useState({userId: '', userName: '', userPw: '', userPwChk: '', userPhone: '', userPart: ''});

  // navigate
  const navigate = useNavigate();


  // check state
  const [isIdAvailable, setIsIdAvailable] = useState(false); // 아이디 사용 가능 여부 상태
  const [isIdChecked, setIsIdChecked] = useState(false); // 아이디 중복 확인 여부 상태
  const [isPwMatch, setIsPwMatch] = useState(true); // 비밀번호 일치 여부 상태
  
  // error state
  const [errors, setErrors] = useState({
    userIdError: false,
    userNameError: false,
    userPwError: false,
    userPwChkError: false,
    userPhoneError: false,
    userPartError: false
  });

  // 최소 글자 1개 이상
  // ID
  const handleIdChange = (e) => {
    const newId = e.target.value;
    setFormData({...formData, userId: newId});
    setIsIdChecked(false);
  };
  // Name
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setFormData({...formData, userName: newName});
  };

  // id check
  const checkIdAvailability = () => {
    api.post('/user/idcheck', { userId: formData.userId })
      .then(res => {
        if (res.data.isAvailable) {setIsIdAvailable(true);} 
        else {setIsIdAvailable(false);}
        setIsIdChecked(true);})
      .catch(err => console.log(err));
  };

  // pw check
  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setFormData({...formData, userPw: newPass});
  };

  // pw duplication check
  const handlePwcheckChange = (e) => {
    const newPwck = e.target.value;
    setFormData({...formData, userPwChk: newPwck});
  };

  // pw check input
  const handlePasswordCheckChange = (e) => {
    const value = e.target.value;
    setFormData({...formData, userPwChk: value});
  const isMatch = formData.userPw === value;
    setIsPwMatch(isMatch);
    setErrors({...errors, userPwChkError: !isMatch});
  };

  // phone check
  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    setFormData({...formData, userPhone: newPhone});
  };


  // part check
  const handlePartChange = (e) => {
    const newPart = e.target.value;
    setFormData({...formData, userPart: newPart});
  };

  // ref
  const idRef = useRef(null);
  const nameRef = useRef(null);
  const pwRef = useRef(null);
  const pwChkRef = useRef(null);
  const phoneRef = useRef(null);
  const partRef = useRef(null);

  // submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    // input null 여부
    const newErrors = {
      userIdError: !formData.userId,
      userNameError: !formData.userName,
      userPwError: !formData.userPw,
      userPwChkError: !formData.userPwChk,
      userPhoneError: !formData.userPhone,
      userPartError: !formData.userPart
    };

    setErrors(newErrors);

    // 하나라도 비어있다면 회원가입 진행하지 않음
  if (Object.values(newErrors).some(error => error)) {
    return;
  }
    // axios post
    api.post('/user/join', formData)
    .then(res => {
      if (res.data.success) {
        navigate('/');
      } else {
      }
    })
    .catch(err => {
    });
  };

  return (
    <div className='join_page'>
      <form onSubmit={submitHandler} className='join_form'>
        <Logo />
        <div className='input_container'>
        {/* id */}
        <div className='input_wrap'>
          <label htmlFor="user_id">아이디</label>
          <div className='input-icon'>
          <input ref={idRef} id='user_id' type="text" onChange={e => {setFormData({...formData, userId: e.target.value});
          setIsIdChecked(false);}}onBlur={checkIdAvailability} placeholder='아이디를 입력하세요.'/>
          <span className='mini_icon' style={{ color: (isIdAvailable && isIdChecked && formData.userId) ? 'green' : 'black' }}><FaCheck /></span>
        </div>
        {isIdChecked && formData.userId && (isIdAvailable ?   <p style={{ color: 'blue' }}>사용 가능한 아이디입니다</p> : <p style={{ color: 'red' }}>이미 사용중인 아이디입니다</p>)}
        {errors.userIdError && <p style={{ color: 'red' }}>필수 입력 사항입니다.</p>}
        </div>
        {/* name */}
        <div className='input_wrap'>
          <label htmlFor="user_name">이름</label>
          <div className='input-icon'>
            <input ref={nameRef} id='user_name' type="text" onChange={e => setFormData({...formData, userName: nameRef.current.value})} placeholder='이름을 입력하세요.'/>
            <span className='mini_icon' style={{color: formData.userName ? 'green' : 'black'}}><FaCheck /></span>
          </div>
          {errors.userNameError && <p style={{ color: 'red' }}>필수 입력 사항입니다.</p>}
        </div>
        {/* pw */}
        <div className='input_wrap'>
          <label htmlFor="user_pw">비밀번호</label>
          <div className='input-icon'>
            <input ref={pwRef} id='user_pw' type="password"onChange={e => setFormData({...formData, userPw: pwRef.current.value})} placeholder='비밀번호를 입력하세요.' />
            <span className='mini_icon' style={{color: formData.userPw ? 'green' : 'black'}}><TbLock /></span>
          </div>
          {errors.userPwError && <p style={{ color: 'red' }}>필수 입력 사항입니다.</p>}
        </div>
        {/* pw check */}
        <div className='input_wrap'>
          <label htmlFor="user_pw_chk">비밀번호 확인</label>
          <div className='input-icon'>
          <input ref={pwChkRef} id="user_pw_chk" type="password" onChange={handlePasswordCheckChange} placeholder='위의 비밀번호를 다시 입력해주세요.' />
          <span className='mini_icon' style={{ color: (isPwMatch && formData.userPwChk) ? 'green' : 'black' }}>{isPwMatch ? <TbLockCheck /> : <TbLock />}</span>
          </div>
          {errors.userPwChkError && <p style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</p>}
        </div>
        {/* phone */}
        <div className='input_wrap'>
          <label htmlFor="user_phone">휴대폰</label>
          <div className='input-icon'>
            <input ref={phoneRef} id='user_phone' type="text"onChange={e => setFormData({...formData, userPhone: phoneRef.current.value})} placeholder='휴대폰 번호를 입력하세요.(-제외)' />
            <span className='mini_icon' style={{color: formData.userPhone ? 'green' : 'black'}}><FaCheck /></span>
          </div>
          {errors.userPhoneError && <p style={{ color: 'red' }}>필수 입력 사항입니다.</p>}
        </div>
        {/* part */}
        <div className='input_wrap'>
         <label htmlFor="user_part">소속</label>
          <div className='input-icon'>
            <input ref={partRef} id='user_part' type="text"onChange={e => setFormData({...formData, userPart: partRef.current.value})} placeholder='소속을 입력하세요.' />
            <span className='mini_icon' style={{color: formData.userPart ? 'green' : 'black'}}><FaCheck /></span>
          </div>
          {errors.userPartError && <p style={{ color: 'red' }}>필수 입력 사항입니다.</p>}
        </div>
      </div>
        {/* button join */}
        <div>
          <button className='button_join'>회원가입</button>
        </div>
      </form>
    </div>
  );
};

export default JoinPage;