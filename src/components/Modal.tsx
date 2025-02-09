'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={styles.modal} 
        onClick={isMobile ? undefined : (e) => e.stopPropagation()}
      >
        {!isMobile && <button className={styles.closeButton} onClick={onClose}>&times;</button>}
        <div className={styles.modalText}>
          {children}
        </div>
      </div>
    </div>
  );
} 