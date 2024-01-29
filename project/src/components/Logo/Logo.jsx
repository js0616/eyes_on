import React from 'react';
import { Link } from 'react-router-dom';
import { RiEye2Line } from "react-icons/ri";

const Logo = () => {
  return (
    <h1 className='common_logo'>
      <Link to='/'><span className='txt_left'>EYES</span> <span className='txt_right'><span className='icon'><RiEye2Line /></span>N</span></Link>
    </h1>
  );
};

export default Logo;