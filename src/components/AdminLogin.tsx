'use client';

import { useState } from 'react';
import styles from './AdminLogin.module.css';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'hello') {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Admin Login</h2>
        <div className={styles.inputGroup}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Enter password"
            className={error ? styles.error : ''}
          />
          {error && <span className={styles.errorMessage}>Incorrect password</span>}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
} 