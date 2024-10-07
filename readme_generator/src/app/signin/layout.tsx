import type { Metadata } from 'next'
import AuthLayout from '@/components/AuthLayout'

export const metadata: Metadata = {
  title: 'Sign In - ReadmeGen',
  description: 'Sign in to your ReadmeGen account to create professional READMEs for your projects.',
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthLayout>{children}</AuthLayout>
}