import { Project } from "../types";

// TODO: Move this to API
export const PROJECTS: Project[] = [
  {
    title: 'ClimateCal',
    date: 'Dec 2025',
    subtext: 'IoT Weather Monitoring System built with Arduino Uno, DHT22 sensor, BMP180 pressure sensor, achieving ±2% accuracy. Features a responsive web dashboard with real-time data visualization and cloud-based storage with Supabase.',
    url: 'https://github.com/NITESH000009',
  },
  {
    title: 'Smart Power Monitor',
    date: 'Mar 2026',
    subtext: 'Real-time electricity consumption monitor using ACS712 current sensor, Arduino, and LCD display. Tracks voltage, current, power consumption with cost calculation and SMS/email alerts for unusual patterns.',
    url: 'https://github.com/NITESH000009',
  },
  {
    title: 'ML Predictive Maintenance',
    date: 'Apr 2026',
    subtext: 'ML-based predictive maintenance system using sensor data from IoT devices. Trained Random Forest and XGBoost models with scikit-learn, deployed as a Flask API with a visualization dashboard.',
    url: 'https://github.com/NITESH000009',
  },
  {
    title: 'Portfolio',
    date: 'Mar 2026',
    subtext: 'An immersive 3D portfolio built with Next.js, Three.js, GSAP, and Tailwind CSS featuring interactive scroll animations and 3D models.',
    url: 'https://niteshportfolio26.vercel.app/',
  },
];
