'use client';


import styles from './page.module.css';
import { FaDiscord, FaEnvelope } from 'react-icons/fa';

export default function InquiriesPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Work With Us</h1>
        <p className={styles.intro}>
          Interested in collaborating with Razzleberries?
          <br />
          We&apos;re always excited to connect with talented creators and explore new opportunities.
        </p>

        <div className={styles.contactMethods}>
          <div className={styles.primaryContact}>
            <h2>Primary Contact Method</h2>
            <a 
              href="mailto:contact@razzleberri.es"
              className={styles.emailButton}
            >
              <FaEnvelope />
              <span>contact@razzleberri.es</span>
            </a>
            <p className={styles.note}>
              For all business inquiries, please email us directly. We aim to respond within 2-3 business days.
            </p>
          </div>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <div className={styles.secondaryContact}>
            <h2>Alternative Contact</h2>
            <a 
              href="https://discord.gg/zPb4TNg4pM"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.discordButton}
            >
              <FaDiscord />
              <span>Join our Discord</span>
            </a>
            <p className={styles.note}>
              You can also reach out through our Discord server. Please use the #work-inquiries channel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 