import './globals.css'
import './github-markdown.css'
import { Inter } from 'next/font/google'
import { VisitLogger } from '@/components/visit-logger'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })
export const metadata = {
  title: 'AI GitHub README Generator',
  description: 'Generate attractive READMEs for your GitHub repositories using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
        {/* GitHub favicon links */}
        <link rel="mask-icon" href="https://github.githubassets.com/assets/pinned-octocat-093da3e6fa40.svg" color="#000000" />
        <link rel="alternate icon" className="js-site-favicon" type="image/png" href="https://github.githubassets.com/favicons/favicon.png" />
        <link rel="icon" className="js-site-favicon" type="image/svg+xml" href="https://github.githubassets.com/favicons/favicon.svg" data-base-href="https://github.githubassets.com/favicons/favicon" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>{children}    
        <VisitLogger />
      </body>
    </html>
  )
}
