import Link from 'next/link'
import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-secondary-900">
      <header className="bg-secondary-800 py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-2xl font-bold text-primary-500 flex items-center">
            <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            ReadmeGen
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="bg-secondary-800 py-4 text-center text-secondary-400">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} ReadmeGen. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}