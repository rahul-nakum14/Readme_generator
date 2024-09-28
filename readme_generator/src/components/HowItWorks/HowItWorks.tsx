import { HOW_IT_WORKS_STEPS } from '@/lib/constants'
import styles from './HowItWorks.module.css'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.howItWorks}>
      <div className={styles.container}>
        <h2 className={styles.title}>How It Works</h2>
        <div className={styles.steps}>
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}