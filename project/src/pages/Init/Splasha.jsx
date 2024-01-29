import React, { useEffect, useState } from 'react';
import './Splash.css';

const Splasha = () => {
  return (
    <div className='splash' style={{ background: '#ccc',}}>
      <div className='inner' style={{width: '350px', height: '350px', borderRadius: '50px', background: '#fff'}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" className='eye'>
          <path d="M150 15a135 135 0 0 1 0 270a135 135 0 0 1 0 -270" stroke="#000" strokeWidth="28" fill="transparent"/>
          <path d="M150 15a135 135 0 0 1 0 270a135 135 0 0 1 0 -270" stroke="#104fe0" strokeWidth="30" fill="transparent"/>
          {/* <circle cx="150" cy="150" r="75" fill="#000" stroke="#000" className="middle-circle" /> */}
          <circle cx="150" cy="150" r="75" fill="#104fe0" className="middle-circle-color" />
          <circle cx="150" cy="95" r="40" fill="#fff" className='trans-circle' />
          <circle cx="150" cy="95" r="20" fill="#f00" className='point-circle-color' />
        </svg>
      </div>
    </div>
  );
};

export default Splasha;