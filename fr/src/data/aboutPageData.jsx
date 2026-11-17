
import {
  FaDiagramProject,
  FaCube,
  FaPlug,
  FaBrain,
  FaRobot,
  FaLanguage,
  FaWandMagicSparkles,
} from 'react-icons/fa6';

import { SiHuggingface } from 'react-icons/si';

const dev = (name, variant = 'original') =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-${variant}.svg`;

export const nameColors = ['#27ff86', '#f4daa1', '#46f2ec'];

export const techStacks = [
  {
    title: 'Programming',
    accent: '#27fff3',
    wide: false,
    items: [
      { label: 'Java', logo: dev('java'), glow: '#f89820' },
      { label: 'Python', logo: dev('python'), glow: '#4b8bbe' },
      { label: 'JavaScript', logo: dev('javascript'), glow: '#f7df1e' },
      { label: 'SQL', logo: dev('mysql'), glow: '#4479a1' },
    ],
  },

  {
    title: 'Core Concepts',
    accent: '#ff8da2',
    wide: false,
    items: [
      {
        label: 'DSA',
        title: 'Data Structures and Algorithms',
        icon: <FaDiagramProject />,
        glow: '#ff8da2',
      },
      {
        label: 'OOP',
        title: 'Object-Oriented Programming',
        icon: <FaCube />,
        glow: '#c084fc',
      },
      {
        label: 'REST APIs',
        icon: <FaPlug />,
        glow: '#27fff3',
      },
    ],
  },

  {
    title: 'AI & Generative AI',
    accent: '#ff8da2',
    wide: false,
    items: [
      {
        label: 'Generative AI',
        icon: <FaWandMagicSparkles />,
        glow: '#ff8da2',
      },
      {
        label: 'NLP',
        icon: <FaLanguage />,
        glow: '#27fff3',
      },
      {
        label: 'Transformers',
        icon: <FaDiagramProject />,
        glow: '#a78bfa',
      },
      {
        label: 'Hugging Face',
        icon: <SiHuggingface />,
        glow: '#FFD21E',
      },
      {
        label: 'Scikit-learn',
        logo: dev('scikitlearn'),
        glow: '#F7931E',
      },
    ],
  },

  {
    title: 'AI Frameworks',
    accent: '#a78bfa',
    wide: false,
    items: [
      {
        label: 'TensorFlow',
        logo: dev('tensorflow'),
        glow: '#FF6F00',
      },
      {
        label: 'PyTorch',
        logo: dev('pytorch'),
        glow: '#EE4C2C',
      },
      {
        label: 'OpenCV',
        logo: dev('opencv'),
        glow: '#5C3EE8',
      },
    ],
  },

  {
    title: 'Backend & Databases',
    accent: '#27ff86',
    wide: false,
    items: [
      {
        label: 'Node.js',
        logo: dev('nodejs'),
        glow: '#5fa04e',
      },
      {
        label: 'Express.js',
        logo: dev('express'),
        glow: '#ffffff',
        invert: true,
      },
      {
        label: 'FastAPI',
        logo: dev('fastapi'),
        glow: '#009688',
      },
      {
        label: 'MongoDB',
        logo: dev('mongodb'),
        glow: '#47a248',
      },
      {
        label: 'PostgreSQL',
        logo: dev('postgresql'),
        glow: '#336791',
      },
    ],
  },

  {
    title: 'Frontend',
    accent: '#7df9ff',
    wide: false,
    items: [
      {
        label: 'React.js',
        logo: dev('react'),
        glow: '#61dafb',
      },
      {
        label: 'Tailwind CSS',
        logo: dev('tailwindcss'),
        glow: '#38bdf8',
      },
      {
        label: 'HTML5',
        logo: dev('html5'),
        glow: '#e34f26',
      },
      {
        label: 'CSS3',
        logo: dev('css3'),
        glow: '#1572b6',
      },
    ],
  },

  {
    title: 'Tools & Platforms',
    accent: '#f4daa1',
    wide: true,
    items: [
      {
        label: 'Git',
        logo: dev('git'),
        glow: '#f05032',
      },
      {
        label: 'GitHub',
        logo: dev('github'),
        glow: '#ffffff',
        invert: true,
      },
      {
        label: 'Docker',
        logo: dev('docker'),
        glow: '#2496ed',
      },
      {
        label: 'Kubernetes',
        logo: dev('kubernetes'),
        glow: '#326ce5',
      },
      {
        label: 'Azure',
        logo: dev('azure'),
        glow: '#0078d4',
      },
      {
        label: 'Linux',
        logo: dev('linux'),
        glow: '#fcc624',
      },
    ],
  },
];
