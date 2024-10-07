import type { Metadata } from 'next'
import AuthLayout from '@/components/AuthLayout'

export const metadata: Metadata = {
  title: 'Sign Up - ReadmeGen',
  description: 'Create a ReadmeGen account to start generating professional READMEs for your projects.',
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthLayout>{children}</AuthLayout>
}