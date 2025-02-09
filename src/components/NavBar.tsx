'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './NavBar.module.css';
import { 
  FaDiscord, 
  FaTwitter, 
  FaYoutube, 
  FaInstagram,
  FaChevronDown,
  FaBars
} from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import BlueskyIcon from './BlueskyIcon';

export default function NavBar() {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handleScroll = () => {
      if (!isHomePage || isMobile) return;
      const scrollPercent = Math.min(window.scrollY / 20, 1);
      setScrollProgress(scrollPercent);
    };

    if (!isHomePage || isMobile) {
      setScrollProgress(1);
    } else {
      handleScroll();
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isHomePage, isMobile]);

  if (!mounted) {
    return <nav className={styles.navbar} style={{ height: '70px' }} />;
  }

  const socialLinks = [
    { icon: FaDiscord, href: 'https://discord.gg/zPb4TNg4pM', label: 'Discord' },
    { icon: BlueskyIcon, href: 'https://bsky.app/profile/razzleberriesab.bsky.social', label: 'Bluesky' },
    { icon: FaTwitter, href: 'https://x.com/RazzleberriesAB', label: 'Twitter' },
    { icon: FaYoutube, href: 'https://www.youtube.com/@Razzleberries', label: 'YouTube' },
    { icon: FaInstagram, href: 'https://www.instagram.com/razzleberriesab/', label: 'Instagram' }
  ];

  const expandedLogoSize = 800;
  const collapsedLogoSize = 150;
  const logoSize = isMobile ? 200 : expandedLogoSize - ((expandedLogoSize - collapsedLogoSize) * scrollProgress);
  const navHeight = isMobile ? 70 : 100 - (30 * scrollProgress);
  const isCollapsed = scrollProgress === 1;

  return (
    <nav 
      className={styles.navbar}
      style={{
        height: !isHomePage || isCollapsed || isMobile ? '70px' : `${navHeight}vh`,
      }}
    >
      <div className={`${styles.navContent} ${!isHomePage || isCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <div style={{ 
              width: `${logoSize}px`, 
              height: `${logoSize}px`,
              position: 'relative'
            }}>
              <Image
                src="/RN_Logo_White.png"
                alt="Razzleberries Logo"
                fill
                className={styles.logo}
                priority
              />
            </div>
          </Link>
        </div>
        
        <button 
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars />
        </button>

        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
          <Link 
            href="/projects"
            className={`${styles.mobileLink} ${pathname === '/projects' ? styles.active : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Our Projects
          </Link>
          <Link 
            href="/contact"
            className={`${styles.mobileLink} ${pathname === '/contact' ? styles.active : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Contact Us
          </Link>
        </div>

        <div className={styles.linksContainer}>
          <Link 
            href="/projects" 
            className={`${styles.link} ${pathname === '/projects' ? styles.active : ''}`}
          >
            Our Projects
          </Link>
          <Link 
            href="/contact" 
            className={`${styles.link} ${pathname === '/contact' ? styles.active : ''}`}
          >
            Contact Us
          </Link>
        </div>

        <div className={styles.socialLinks}>
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label={social.label}
            >
              <social.icon />
            </a>
          ))}
        </div>

        {isHomePage && !isCollapsed && (
          <div className={styles.scrollPrompt}>
            <FaChevronDown className={styles.leftArrow} />
            <span>scroll to learn more</span>
            <FaChevronDown className={styles.rightArrow} />
          </div>
        )}
      </div>
    </nav>
  );
} 