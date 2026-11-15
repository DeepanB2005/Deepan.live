import { FaDiagramProject, FaCube, FaPlug, FaSitemap } from 'react-icons/fa6';

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
      { label: 'REST APIs', icon: <FaPlug />, glow: '#27fff3' },
      {
        label: 'DB Design',
        title: 'Database Design',
        icon: <FaSitemap />,
        glow: '#f4daa1',
      },
    ],
  },
  {
    title: 'Backend & Databases',
    accent: '#27ff86',
    wide: false,
    items: [
      { label: 'Node.js', logo: dev('nodejs'), glow: '#5fa04e' },
      { label: 'Express.js', logo: dev('express'), glow: '#ffffff', invert: true },
      { label: 'FastAPI', logo: dev('fastapi'), glow: '#009688' },
      { label: 'MongoDB', logo: dev('mongodb'), glow: '#47a248' },
      { label: 'PostgreSQL', logo: dev('postgresql'), glow: '#336791' },
    ],
  },
  {
    title: 'Frontend',
    accent: '#7df9ff',
    wide: false,
    items: [
      { label: 'React.js', logo: dev('react'), glow: '#61dafb' },
      { label: 'HTML5', logo: dev('html5'), glow: '#e34f26' },
      { label: 'CSS3', logo: dev('css3'), glow: '#1572b6' },
      { label: 'Tailwind CSS', logo: dev('tailwindcss'), glow: '#38bdf8' },
    ],
  },
  {
    title: 'Tools & Platforms',
    accent: '#f4daa1',
    wide: true,
    items: [
      { label: 'Git', logo: dev('git'), glow: '#f05032' },
      { label: 'GitHub', logo: dev('github'), glow: '#ffffff', invert: true },
      { label: 'Docker', logo: dev('docker'), glow: '#2496ed' },
      { label: 'Kubernetes', logo: dev('kubernetes'), glow: '#326ce5' },
      { label: 'Postman', logo: dev('postman'), glow: '#ff6c37' },
      { label: 'VS Code', logo: dev('vscode'), glow: '#007acc' },
      { label: 'Azure', logo: dev('azure'), glow: '#0078d4' },
      { label: 'Linux', logo: dev('linux'), glow: '#fcc624' },
    ],
  },
];
