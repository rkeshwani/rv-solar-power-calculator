import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

const SolarPanel3D = ({ position, dimensions, onDragEnd }) => {
  const meshRef = useRef();
  const { camera, gl, scene } = useThree();
  
  useEffect(() => {
    if (!meshRef.current) return;

    const controls = new DragControls([meshRef.current], camera, gl.domElement);
    
    controls.addEventListener('dragstart', () => {
      scene.orbitControls.enabled = false;
    });

    controls.addEventListener('drag', (event) => {
      // Force the Y position to stay at the roof height
      if (meshRef.current) {
        meshRef.current.position.y = position[1]; // Keep the original height
      }
    });

    controls.addEventListener('dragend', (event) => {
      scene.orbitControls.enabled = true;
      
      const newPosition = meshRef.current.position;
      onDragEnd({
        x: newPosition.x,
        y: newPosition.z
      });
    });

    return () => {
      controls.dispose();
    };
  }, [camera, gl, onDragEnd, position]);

  return (
    <mesh 
      ref={meshRef}
      position={position}
    >
      <boxGeometry args={[dimensions.length, dimensions.height, dimensions.width]} />
      <meshStandardMaterial color="#1976d2" />
    </mesh>
  );
};

const RoofFixture3D = ({ position, dimensions, type, onDragEnd }) => {
  const meshRef = useRef();
  const { camera, gl, scene } = useThree();
  
  useEffect(() => {
    if (!meshRef.current) return;

    const controls = new DragControls([meshRef.current], camera, gl.domElement);
    
    controls.addEventListener('dragstart', () => {
      scene.orbitControls.enabled = false;
    });

    controls.addEventListener('drag', (event) => {
      if (meshRef.current) {
        meshRef.current.position.y = position[1];
      }
    });

    controls.addEventListener('dragend', (event) => {
      scene.orbitControls.enabled = true;
      
      const newPosition = meshRef.current.position;
      onDragEnd({
        x: newPosition.x,
        y: newPosition.z
      });
    });

    return () => {
      controls.dispose();
    };
  }, [camera, gl, onDragEnd, position]);

  const getFixtureColor = () => {
    switch (type) {
      case 'ac': return '#A0A0A0';
      case 'vent': return '#8B4513';
      case 'skylight': return '#87CEEB';
      case 'antenna': return '#696969';
      default: return '#808080';
    }
  };

  return (
    <mesh 
      ref={meshRef}
      position={position}
    >
      <boxGeometry args={[dimensions.length, dimensions.height, dimensions.width]} />
      <meshStandardMaterial color={getFixtureColor()} />
    </mesh>
  );
};

const RVModel = ({ dimensions, solarPanels, roofFixtures, onPanelMove, onFixtureMove }) => {
  const rvRef = useRef();
  const height = 3;

  return (
    <group ref={rvRef}>
      {/* RV body */}
      <mesh position={[0, height/2, 0]}>
        <boxGeometry args={[dimensions.length, height, dimensions.width]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Solar panels */}
      {solarPanels.map((panel, index) => (
        <SolarPanel3D 
          key={index}
          position={[panel.x, height, panel.y]}
          dimensions={{
            length: panel.length,
            width: panel.width,
            height: 0.1
          }}
          onDragEnd={(newPosition) => onPanelMove(index, newPosition)}
        />
      ))}
      
      {/* Roof fixtures */}
      {roofFixtures.map((fixture) => (
        <RoofFixture3D
          key={fixture.id}
          position={[fixture.x, height, fixture.y]}
          dimensions={fixture.dimensions}
          type={fixture.type}
          onDragEnd={(newPosition) => onFixtureMove(fixture.id, newPosition)}
        />
      ))}
    </group>
  );
};

const Scene = ({ dimensions, solarPanels, roofFixtures, onPanelMove, onFixtureMove }) => {
  const { scene } = useThree();
  
  return (
    <>
      <OrbitControls 
        ref={(controls) => {
          scene.orbitControls = controls;
        }}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
      />
      <RVModel 
        dimensions={dimensions}
        solarPanels={solarPanels}
        roofFixtures={roofFixtures}
        onPanelMove={onPanelMove}
        onFixtureMove={onFixtureMove}
      />
      <gridHelper args={[30, 30]} />
    </>
  );
};

export const RV3DViewer = ({ dimensions, solarPanels, roofFixtures, onPanelMove, onFixtureMove }) => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas camera={{ position: [10, 10, 10] }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Scene 
          dimensions={dimensions}
          solarPanels={solarPanels}
          roofFixtures={roofFixtures}
          onPanelMove={onPanelMove}
          onFixtureMove={onFixtureMove}
        />
      </Canvas>
    </div>
  );
}; 