import React from 'react';

const Cursor = ({ pos }) => {
  return (
    <div className='cursor' style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}></div>
  );
};

export default Cursor;