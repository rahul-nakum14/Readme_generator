"use client"

import { Github } from 'lucide-react'
import { useState } from 'react'
import { ContactUs } from './contact-us'

export function Header() {
  const [isContactUsOpen, setIsContactUsOpen] = useState(false)

  return (
    <header className="border-b border-[#30363d] bg-[#0d1117]">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Github className="h-8 w-8 text-white" />
            <span className="text-white font-semibold">README Generator</span>
          </div>
          <nav className="flex items-center space-x-4">
            <button
              onClick={() => setIsContactUsOpen(true)}
              className="text-gray-300 hover:text-white"
            >
              Contact Us
            </button>
          </nav>
        </div>
      </div>
      <ContactUs isOpen={isContactUsOpen} onClose={() => setIsContactUsOpen(false)} />
    </header>
  )
}

