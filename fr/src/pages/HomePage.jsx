import { useLocation } from 'react-router-dom';

import Hero from '../components/hero.jsx';
import PillNav from '../components/nav.jsx';
import AboutPage from './AboutPage.jsx';
import logo from '../assets/react.svg';

function HomePage() {
  const location = useLocation();

  const navItems = [
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '#about' },
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
<div className="relative w-full bg-black text-white">
      <PillNav
        logo={logo}
        logoAlt="Company Logo"
        items={navItems}
        activeHref={location.pathname}
      />

      <main>
        <section id="home" className="relative min-h-screen">
          <Hero />
        </section>

        <section id="about" className="relative min-h-screen">
          <AboutPage />
        </section>
      </main>

    </div>
  );
}

export default HomePage;