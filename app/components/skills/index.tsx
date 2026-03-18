'use client';

import { Text, useScroll, Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { isMobile } from "react-device-detect";

const SKILLS = [
  "Next.js", "React", "Three.js", "Tailwind CSS",
  "Arduino", "ESP32", "IoT",
  "Python", "Flask", "Machine Learning",
  "C++", "JavaScript", "TypeScript"
];

const SkillItem = ({ text, index, total }: { text: string, index: number, total: number }) => {
  const ref = useRef<THREE.Group>(null);
  const data = useScroll();

  useFrame((state, delta) => {
    // Calculate a stagger based on index
    const start = 0.2 + (index / total) * 0.2;
    const d = data.range(start, 0.2);
    
    if (ref.current) {
      // Fade in and slide up
      ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, d * 2 - 1, 4, delta);
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      ref.current.children.forEach(c => {
        if ((c as any).fillOpacity !== undefined) {
          (c as any).fillOpacity = d;
        }
      });
    }
  });

  const fontProps = {
    font: "./soria-font.ttf",
    fontSize: isMobile ? 0.3 : 0.5,
    color: 'white',
    anchorX: 'center' as const,
    anchorY: 'middle' as const,
  };

  // Arrange in a scattered circular/grid pattern
  const row = Math.floor(index / 4);
  const col = index % 4;
  const xOffset = isMobile ? (col - 1.5) * 1.5 : (col - 1.5) * 2.5;
  const zOffset = isMobile ? (row - 1.5) * -1.5 : (row - 1.5) * -2;
  const randomY = Math.sin(index * 4) * 0.5;

  return (
    <group position={[xOffset, -2 + randomY, zOffset]} ref={ref}>
      <Billboard>
        <Text {...fontProps}>{text}</Text>
      </Billboard>
    </group>
  );
};

const Skills = () => {
  const groupRef = useRef<THREE.Group>(null);
  const data = useScroll();

  useFrame(() => {
    // Only show when scrolling between Hero and Experience
    const visibleStart = data.range(0.1, 0.1);
    const visibleEnd = data.range(0.7, 0.1);
    if (groupRef.current) {
      groupRef.current.visible = visibleStart > 0 && visibleEnd < 1;
    }
  });

  return (
    <group position={[0, -18, 0]} ref={groupRef}>
      <Billboard position={[0, 4, -2]}>
        <Text 
          font="./soria-font.ttf" 
          fontSize={isMobile ? 0.8 : 1.2} 
          color="#bdd1e3"
          anchorX="center"
        >
          MY LOGICAL TOOLS
        </Text>
      </Billboard>
      {SKILLS.map((skill, i) => (
        <SkillItem key={skill} text={skill} index={i} total={SKILLS.length} />
      ))}
    </group>
  );
};

export default Skills;
