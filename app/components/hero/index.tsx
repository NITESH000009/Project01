'use client';

import { Text } from "@react-three/drei";

import { useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import CloudContainer from "../models/Cloud";
import StarsContainer from "../models/Stars";
import WindowModel from "../models/WindowModel";
import TextWindow from "./TextWindow";
import AnimatedWord from "./AnimatedWord";
import { isMobile } from "react-device-detect";

const Hero = () => {
  const titleRef = useRef<THREE.Mesh>(null);
  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100 && titleRef.current) {
      gsap.fromTo(titleRef.current.position, {
        y: -10,
        duration: 1,
        // delay: 1.5,
      }, {
        y: 0,
        duration: 3
      });
    }
  }, [progress]);

  const fontProps = {
    font: "./soria-font.ttf",
    fontSize: isMobile ? 1.4 : 2.2,
  };

  return (
    <>
      <group position={[0, 2, -10]} ref={titleRef}>
        <AnimatedWord text="Hi, I am Nitesh" position={[0, isMobile ? 0.8 : 1.2, 0]} fontProps={fontProps} />
        <AnimatedWord text="Singh Bhadoria." position={[0, isMobile ? -0.6 : -1.0, 0]} fontProps={fontProps} />
      </group>
      <StarsContainer />
      <CloudContainer/>
      <group position={[0, -25, 5.69]}>
        <pointLight castShadow position={[1, 1, -2.5]} intensity={60} distance={10}/>
        <WindowModel receiveShadow/>
        <TextWindow/>
      </group>
    </>
  );
};

export default Hero;
