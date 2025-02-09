'use client';

import styles from './page.module.css';
import { FaTwitter, FaInstagram } from 'react-icons/fa';
import BlueskyIcon from '@/components/BlueskyIcon';

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Get in Touch</h1>
      
      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <div className={styles.discordSection}>
            <h2 className={styles.discordTitle}>Join Our Community on Discord</h2>
            
            <div className={styles.discordContent}>
              <div className={styles.discordWidget}>
                <iframe 
                  src="https://discord.com/widget?id=716015727630483576&theme=dark" 
                  width="600" 
                  height="350" 
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                  title="Discord Server Widget"
                />
              </div>

              <div className={styles.discordText}>
                <p className={styles.discordDescription}>
                  Our Discord server is the best place to:
                </p>
                <ul className={styles.discordFeatures}>
                  <li>Get instant help and support for our content</li>
                  <li>Stay updated on our latest releases</li>
                  <li>Connect with other community members</li>
                  <li>Share your creations and experiences</li>
                  <li>Participate in events and discussions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.rightColumn}>
          <h2 className={styles.subtitle}>Other Ways to Connect</h2>
          <p className={styles.alternativeDescription}>
            You can also reach us and stay updated through our social media channels:
          </p>
          
          <div className={styles.socialLinks}>
            <a 
              href="https://twitter.com/RazzleberriesAB" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <FaTwitter />
              <span>Follow us on Twitter for quick updates and announcements</span>
            </a>
            
            <a 
              href="https://bsky.app/profile/razzleberriesab.bsky.social" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <BlueskyIcon />
              <span>Join our Bluesky community for exclusive content</span>
            </a>
            
            <a 
              href="https://www.instagram.com/razzleberriesab" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <FaInstagram />
              <span>Check out our Instagram for visual highlights and stories</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 