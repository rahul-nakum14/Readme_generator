import { FEATURES } from '@/lib/constants'
import { Github, Code, Eye } from 'lucide-react'
import styles from './Features.module.css'

const iconMap = {
  github: Github,
  code: Code,
  eye: Eye,
}

export default function Features() {
  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        <h2 className={styles.title}>Features</h2>
        <div className={styles.grid}>
          {FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon]
            return (
              <div key={index} className={styles.feature}>
                <div className={styles.iconWrapper}>
                  <Icon className={styles.icon} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}