import React from 'react';
import ModelArea from '../../components/ModelArea/ModelArea';
import FloorPlanArea from '../../components/FloorPlan/FloorPlanArea';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const user = useSelector(state => state.user);

  return (
    <>
      <div className='home_page'>
        <ModelArea />
        <FloorPlanArea />
      </div>
    </>
  );
};

export default HomePage;