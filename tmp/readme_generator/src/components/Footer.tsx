import Link from 'next/link'
import { FOOTER_LINKS } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="w-full bg-secondary-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-500">ReadmeGen</h3>
            <p className="text-secondary-300">Automated README generator for your projects.</p>
          </div>
          {FOOTER_LINKS.map((column, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4 text-primary-500">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className="text-secondary-300 hover:text-primary-500 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center text-secondary-400">
          <p>&copy; {new Date().getFullYear()} ReadmeGen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}