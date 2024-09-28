import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>Create Perfect GitHub READMEs</h1>
        <p className={styles.description}>
          Generate professional and informative README files for your GitHub projects in minutes.
        </p>
        <Link href="#get-started" className={styles.cta}>
          Get Started
          <ArrowRight className={styles.icon} />
        </Link>
      </div>
    </section>
  )
}