import React, { useEffect, useRef } from 'react';
import { setIsSplash } from '../../redux/reducers/userSlice';
import './Splash.css';
import { useDispatch } from 'react-redux';

const Splash = () => {
  const splashRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    splashRef.current.addEventListener('animationend', e => {
      if (e.animationName === 'end-animation') {
        dispatch(setIsSplash());
      }
    });
  }, []);

  return (
    <div ref={splashRef} className='splash'>
      <div className='inner'>
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" className='eye'>
          <path d="M150 15a135 135 0 0 1 0 270a135 135 0 0 1 0 -270" stroke="#333" strokeWidth="28" fill="transparent" className="outer-circle" />
          <path d="M150 15a135 135 0 0 1 0 270a135 135 0 0 1 0 -270" stroke="#104fe0" strokeWidth="30" fill="transparent" strokeLinecap="round" className="outer-circle-color" />
          <circle cx="150" cy="150" r="75" fill="#333" className="middle-circle" />
          <circle cx="150" cy="150" r="75" fill="#104fe0" className="middle-circle-color" />
          <circle cx="150" cy="95" r="40" fill="#fff" className='trans-circle' />
          <circle cx="150" cy="95" r="20" fill="#f00" className='point-circle-color' />
        </svg>
        <div className='text'>
          <h2 className='slogan'>안전을 지키는 또 다른 눈</h2>
          <h2 className='splash_logo'>EYES ON</h2>
        </div>
      </div>
    </div>
  );
};

export default Splash;