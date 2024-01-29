import React from 'react';
import { useGLTF } from '@react-three/drei';

const ModelLoader = ({ info }) => {
  const { scene, nodes } = useGLTF(info.path);
  
  return (
    <primitive object={scene} position={info?.position} scale={info?.scale} />
  );
};

export default ModelLoader;