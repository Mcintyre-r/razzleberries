'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function ContactPage() {
  const [hoverState, setHoverState] = useState<'none' | 'left' | 'right'>('none');

  return (
    <div className={styles.container}>
      <Link 
        href="/contact/community" 
        className={`${styles.column} ${hoverState === 'left' ? styles.hovered : ''}`}
        onMouseEnter={() => setHoverState('left')}
        onMouseLeave={() => setHoverState('none')}
      >
        <div className={styles.columnContent}>
          <div className={styles.caseImageWrapper}>
            <Image
              src="/case-closed.png"
              alt="Closed Case"
              fill
              className={styles.caseImage}
            />
            <Image
              src="/case-opened.png"
              alt="Opened Case"
              fill
              className={styles.caseImage}
            />
          </div>
          <h2 className={`${styles.columnText} ${hoverState === 'left' ? styles.visible : ''}`}>
            Looking for our community or game help?
          </h2>
        </div>
      </Link>

      <div className={styles.imageColumn}>
        <div className={styles.imageWrapper}>
          <Image
            src="/john-center.png"
            alt="John Center"
            fill
            className={`${styles.image} ${hoverState === 'none' ? styles.visible : ''}`}
          />
          <Image
            src="/john-left.png"
            alt="John Left"
            fill
            className={`${styles.image} ${hoverState === 'left' ? styles.visible : ''}`}
          />
          <Image
            src="/john-right.png"
            alt="John Right"
            fill
            className={`${styles.image} ${hoverState === 'right' ? styles.visible : ''}`}
          />
        </div>
      </div>

      <Link 
        href="/contact/inquiries" 
        className={`${styles.column} ${hoverState === 'right' ? styles.hovered : ''}`}
        onMouseEnter={() => setHoverState('right')}
        onMouseLeave={() => setHoverState('none')}
      >
        <div className={styles.columnContent}>
          <div className={styles.caseImageWrapper}>
            <Image
              src="/case-closed.png"
              alt="Closed Case"
              fill
              className={styles.caseImage}
            />
            <Image
              src="/case-opened.png"
              alt="Opened Case"
              fill
              className={styles.caseImage}
            />
          </div>
          <h2 className={`${styles.columnText} ${hoverState === 'right' ? styles.visible : ''}`}>
            Trying to contact us about a work inquiry?
          </h2>
        </div>
      </Link>
    </div>
  );
}
