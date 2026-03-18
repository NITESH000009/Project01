import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 2, 0),
    year: '2024',
    title: 'SGSITS Indore',
    subtitle: 'B.Tech Electrical Engineering',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-5, -1, -6),
    year: '2025',
    title: 'ClimateCal',
    subtitle: 'IoT Weather Monitoring System',
    position: 'left',
  },
  {
    point: new THREE.Vector3(3, 0, -12),
    year: '2026',
    title: 'ML & Data Science',
    subtitle: 'Certification & Training',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-4, -2, -18),
    year: '2026',
    title: 'Cinematography',
    subtitle: 'College Club Team Member',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1, 2, -24),
    year: new Date().toLocaleDateString('default', { year: 'numeric' }),
    title: '?',
    subtitle: '???',
    position: 'right',
  }
]