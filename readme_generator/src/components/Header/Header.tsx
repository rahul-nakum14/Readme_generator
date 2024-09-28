import Link from 'next/link'
import { FileIcon } from 'lucide-react'
import { SITE_NAME } from '@/lib/constants'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <FileIcon className={styles.icon} />
          <span className={styles.siteName}>{SITE_NAME}</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="#features" className={styles.navLink}>Features</Link>
          <Link href="#how-it-works" className={styles.navLink}>How It Works</Link>
          <Link href="#get-started" className={styles.navLink}>Get Started</Link>
        </nav>
      </div>
    </header>
  )
}