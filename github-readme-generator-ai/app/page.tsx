import ReadmeGenerator from '../components/readme-generator'
import { GitHubBackground } from '../components/github-background'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <GitHubBackground />
      <div className="w-full max-w-4xl relative z-10">
        <h1 className="text-4xl font-semibold text-center mb-8 text-gray-800">
          AI GitHub README Generator
        </h1>
        <ReadmeGenerator />
      </div>
    </main>
  )
}

