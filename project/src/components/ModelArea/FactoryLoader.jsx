import React from 'react';
import { useGLTF } from '@react-three/drei';

const FactoryLoader = ({ info, floor, alpha, isDark }) => {
  const { scene, nodes } = useGLTF(info.path);

  // light control
  nodes.light_group.children.map(item => (
    item.visible = isDark
  ));
  
  // floor control
  ['1F', '2F', '3F', '4F', '5F'].map(item => (
    nodes[item].children.map(child => (
      child.material.opacity = 0
    ))
  ));

  nodes[floor].children.forEach(item => {
    item.material.color.set(0x104fe0);
    item.material.opacity = alpha;
  });

  return (
    <primitive object={scene} position={info?.position} rotation={info?.rotation} scale={info?.scale} />
  );
};

export default FactoryLoader;