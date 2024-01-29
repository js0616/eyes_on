import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import FactoryLoader from './FactoryLoader';
import { useSelector } from 'react-redux';

const ModelArea = () => {
  const cameraRef = useRef(null);
  const [modelScale, setModelScale] = useState(1.9);
  const [modelPosition, setModelPosition] = useState([-0.5,-1.5,0.3]);
  const facility = useSelector(state => state.facility);
  const theme = useSelector(state => state.theme);

  // 3D model info
  const factoryInfo = {
    path: '/models/scene.glb',
    position: modelPosition,
    rotation: [0, (Math.PI * 2 / 360 * 140), 0],
    scale: modelScale
  };
  
  // camera setting
  const cameraSetting = { fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 50 };

  // responsive 3D model
  useEffect(() => {
    const resizeHandler = () => {
      let innerWidth = window.innerWidth;

      if (1680 <= innerWidth) {
        setModelScale(1.9);
        setModelPosition([-0.5,-1.5,0.3]);
      } else if (1280 <= innerWidth) {
        setModelScale(1.8);
        setModelPosition([0.1,-1.5,0.5]);
      } else if (768 <= innerWidth) {
        setModelScale(1.3);
        setModelPosition([1,-1.5,1.5]);
      } else if (480 <= innerWidth) {
        setModelScale(0.9);
        setModelPosition([1,-0.7,1.8]);
      }
    };

    resizeHandler();

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <div className='model_area'>
      <Canvas>
        <ambientLight intensity={1} />
        <directionalLight intensity={1} position={[4,1,3]} />
        <PerspectiveCamera makeDefault ref={cameraRef} position={[0,0,8]} fov={cameraSetting.fov} aspect={cameraSetting.aspect} near={cameraSetting.near} far={cameraSetting.far} />
        <OrbitControls position={[0,0,0]} zoomSpeed={0.5} maxPolarAngle={Math.PI / 2} minPolarAngle={-1 * (Math.PI / 2)} target={[0,0,0]} />
        <Suspense fallback={null}>
          <FactoryLoader info={factoryInfo} floor={facility.currentFloor} alpha={0.65} isDark={theme.isDark} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ModelArea;