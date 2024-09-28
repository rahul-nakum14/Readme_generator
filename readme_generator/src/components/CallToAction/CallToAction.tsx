'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import styles from './CallToAction.module.css'

export default function CallToAction() {
  const [email, setEmail] = useState('')
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    console.log('Submitted email:', email)
    toast({
      title: 'Success!',
      description: 'Thank you for signing up. We\'ll be in touch soon!',
    })
    setEmail('')
  }

  return (
    <section id="get-started" className={styles.callToAction}>
      <div className={styles.container}>
        <h2 className={styles.title}>Ready to Create Your README?</h2>
        <p className={styles.description}>
          Get started now and elevate your GitHub repositories with professional READMEs.
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            require
            className={styles.input}
          />
          <Button type="submit">Sign Up</Button>
        </form>
        <p className={styles.terms}>
          By signing up, you agree to our{' '}
          <a href="#" className={styles.link}>Terms & Conditions</a>
        </p>
      </div>
    </section>
  )
}