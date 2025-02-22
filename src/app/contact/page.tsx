'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function ContactPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.visualViewport 
        ? window.visualViewport.width 
        : document.documentElement.clientWidth;
      setIsMobile(width <= 430);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // We can now use the same layout for both mobile and desktop
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Contact Us</h1>
        <p className={styles.intro}>
          How can we help you today?
        </p>
      </div>
      <div className={styles.buttonContainer}>
        <Link href="/contact/community" className={styles.button}>
          Community & Game Help
          <span className={styles.buttonDescription}>
            Get help with our games or join our community
          </span>
        </Link>
        <Link href="/contact/inquiries" className={styles.button}>
          Business Inquiries
          <span className={styles.buttonDescription}>
            Collaborate with us on new projects
          </span>
        </Link>
      </div>
    </div>
  );
}
