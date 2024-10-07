import Link from 'next/link'
import Image from 'next/image'
import { NAV_ITEMS } from '@/lib/constants'

export default function Header() {
  return (
    <header className="w-full bg-secondary-900 text-white fixed top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src="/../app/public/logo.svg" alt="ReadmeGen Logo" width={200} height={50} priority />
        </Link>
        <ul className="flex space-x-6 items-center">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-secondary-200 hover:text-primary-500 transition-colors">
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/signin" className="text-secondary-200 hover:text-primary-500 transition-colors">
              Sign In
            </Link>
          </li>
          <li>
            <Link href="/signup" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
              Sign Up
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}