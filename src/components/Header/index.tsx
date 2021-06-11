import Link from 'next/link';
import React from 'react';
import styles from './header.module.scss';
export default function Header() {
  return (
      <div className={styles.headerContent}>
        <Link href="/">
          <a>
            <img src="/Logo.svg" alt="logo" />
          </a>
        </Link>
      </div>
  );
}
