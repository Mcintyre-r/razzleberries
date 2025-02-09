'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './Footer.module.css';
import { FaDiscord, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';
import BlueskyIcon from './BlueskyIcon';

export default function Footer() {
  const pathname = usePathname();
  
  // Don't render footer on admin page
  if (pathname === '/admin') {
    return null;
  }

  const socialLinks = [
    { icon: FaDiscord, href: 'https://discord.gg/zPb4TNg4pM', label: 'Discord' },
    { icon: BlueskyIcon, href: 'https://bsky.app/profile/razzleberriesab.bsky.social', label: 'Bluesky' },
    { icon: FaTwitter, href: 'https://x.com/RazzleberriesAB', label: 'Twitter' },
    { icon: FaYoutube, href: 'https://www.youtube.com/@Razzleberries', label: 'YouTube' },
    { icon: FaInstagram, href: 'https://www.instagram.com/razzleberriesab/', label: 'Instagram' }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.leftSection}>
        <div className={styles.socialSection}>
            <h3 className={styles.socialTitle}>Follow us on social media!</h3>
            <div className={styles.socialLinks}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>
          <div className={styles.brandSection}>
            <h2 className={styles.brandTitle}>Razzleberries AB</h2>
            <Image 
              src="/minecraft-partner.png" 
              alt="Official Minecraft Partner" 
              width={150} 
              height={150}
              className={styles.partnerBadge}
            />
          </div>

          
        </div>

        <div className={styles.rightSection}>
          <h2 className={styles.title}>Want to chat with our team?</h2>
          <a 
            href="https://discord.gg/zPb4TNg4pM"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.discordButton}
          >
            <Image
              src="/discord-button.png"
              alt="Join our Discord"
              width={180}
              height={50}
              className={styles.discordImage}
            />
          </a>
          
          <div className={styles.partners}>
            <h3 className={styles.partnersTitle}>Partnered with:</h3>
            <div className={styles.partnerLogos}>
              <Image src="/mojang-logo.png" alt="Mojang" width={150} height={40} />
              <Image src="/microsoft-logo.png" alt="Microsoft" width={150} height={40} />
              <Image src="/nvidia-logo.png" alt="NVIDIA" width={150} height={40} />
              <Image src="/creeperhost-logo.png" alt="CreeperHost" width={150} height={40} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 