'use client';

import { useState, useRef } from 'react';
import styles from './AdminDropdown.module.css';
import { FaEllipsisV } from 'react-icons/fa';

interface AdminDropdownProps {
  onAddClick: () => void;
  onExportClick: () => void;
  onJsonClick: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLogout: () => void;
}

export default function AdminDropdown({ onAddClick, onJsonClick, onExportClick, onFileSelect, onLogout }: AdminDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.dropdown}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.dropdownButton}>
        <FaEllipsisV />
      </button>
      
      {isOpen && (
        <div className={styles.dropdownContent}>
          <button onClick={() => {
            onAddClick();
            setIsOpen(false);
          }}>
            Add New Release
          </button>
          <button onClick={() => {
            onJsonClick();
            setIsOpen(false);
          }}>
            Export Json
          </button>
          <button onClick={() => {
            onExportClick();
            setIsOpen(false);
          }}>
            Export CSV
          </button>
          <button onClick={() => {
            fileInputRef.current?.click();
            setIsOpen(false);
          }}>
            Import CSV
          </button>
          <button onClick={onLogout}>
            Logout
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={(e) => {
          onFileSelect(e);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
} 