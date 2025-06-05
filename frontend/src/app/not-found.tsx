'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import styles from './not-found.module.scss';

export default function NotFound(): React.ReactElement {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button className={styles.button} onClick={() => router.push(`/`)}>
        Go to Home Page
      </button>
    </div>
  );
}
