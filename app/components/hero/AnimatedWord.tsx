'use client';

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

const AnimatedLetter = ({ 
  char, 
  position, 
  fontProps 
}: { 
  char: string; 
  position: [number, number, number]; 
  fontProps: any 
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const [targetRot, setTargetRot] = useState(0);

  const handlePointerOver = () => {
    // Add 360 degrees to the target rotation every time the mouse passes over
    setTargetRot(prev => prev + Math.PI * 2);
  };

  useFrame((_, delta) => {
    if (!ref.current) return;
    
    // Smoothly spin to the newly added target rotation
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, targetRot, 5, delta);
    
    // If the letter hasn't reached its target rotation yet, it's currently "active/flipping"
    const isFlipping = Math.abs(ref.current.rotation.y - targetRot) > 0.05;
    
    // Pop up effect: scale up and move up on Y axis while flipping
    const targetScale = isFlipping ? 1.3 : 1;
    const targetY = isFlipping ? 0.4 : 0;
    
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY + position[1], 0.15);
  });

  return (
    <Text 
      position={position} 
      {...fontProps} 
      ref={ref}
      color="#ffffff"
      onPointerOver={handlePointerOver}
      anchorX="center"
    >
      {char}
    </Text>
  );
};

const getCharWidth = (char: string, fontSize: number) => {
  // Approximate proportional kerning based on the font size block
  const base = fontSize * 0.5;
  if (char === 'i' || char === 'I' || char === 'l' || char === 't' || char === ',' || char === '.') return base * 0.5;
  if (char === 'm' || char === 'w' || char === 'M' || char === 'W' || char === 'N' || char === 'H') return base * 1.5;
  if (char === ' ') return base * 0.8;
  return base;
};

const AnimatedWord = ({ 
  text, 
  position, 
  fontProps 
}: { 
  text: string; 
  position: [number, number, number]; 
  fontProps: any 
}) => {
  const chars = text.split('');
  const fontSize = fontProps.fontSize || 1;
  
  // Calculate relative widths for local kerning
  const widths = chars.map(char => getCharWidth(char, fontSize));
  const totalWidth = widths.reduce((a, b) => a + b, 0);

  let currentX = -totalWidth / 2;

  return (
    <group position={position}>
      {chars.map((char, i) => {
        const charWidth = widths[i];
        // Center the character within its allocated spacing block
        const charPos = [currentX + charWidth / 2, 0, 0] as [number, number, number];
        currentX += charWidth;
        
        if (char === ' ') return null;

        return (
          <AnimatedLetter 
            key={`${char}-${i}`} 
            char={char} 
            position={charPos} 
            fontProps={fontProps} 
          />
        );
      })}
    </group>
  );
};

export default AnimatedWord;
