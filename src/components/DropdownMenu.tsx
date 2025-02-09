'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './DropdownMenu.module.css';

interface DropdownMenuProps {
  isCollapsed?: boolean;
}

export default function DropdownMenu({ isCollapsed }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Skinpacks', href: '/marketplace/skinpacks' },
    { label: 'Maps & Minigames', href: '/marketplace/maps' },
    { label: 'Texture Packs', href: '/marketplace/textures' },
  ];

  return (
    <div 
      className={`${styles.dropdown} ${isCollapsed ? styles.collapsed : ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className={`${styles.dropdownButton} ${isCollapsed ? styles.collapsed : ''}`}>
        Marketplace
      </button>
      {isOpen && (
        <div className={styles.dropdownContent}>
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={styles.dropdownItem}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 