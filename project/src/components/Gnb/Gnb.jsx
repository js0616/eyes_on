import React from 'react';
import { Link } from 'react-router-dom';

const Gnb = ({ pathname }) => {
  return (
    <nav className='gnb'>
      <ul>
        <li>
          <Link to='/' className={`${pathname === '/' ? 'on' : ''}`}>HOME</Link>
        </li>
        <li>
          <Link to='/cctv' className={`${pathname === '/cctv' ? 'on' : ''}`}>CCTV</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Gnb;