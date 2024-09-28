import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
        <nav className={styles.nav}>
          <Link href="#" className={styles.link}>Terms of Service</Link>
          <Link href="#" className={styles.link}>Privacy Policy</Link>
        </nav>
      </div>
    </footer>
  )
}