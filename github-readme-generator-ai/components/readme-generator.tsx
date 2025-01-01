'use client'

import { useState, useEffect, FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Github, Check } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { GitHubMarkdownPreview } from './github-markdown-preview'

export default function ReadmeGenerator() {
  const [repoUrl, setRepoUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [readmeContent, setReadmeContent] = useState('')
  const [error, setError] = useState('')
  const [progress, setProgress] = useState<string[]>([])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!repoUrl.trim()) {
      setError('Please enter a valid GitHub repository URL')
      return
    }
    setIsLoading(true)
    setReadmeContent('')
    setError('')
    setProgress([])

    try {
      const response = await fetch("https://fantastic-fishstick-p4rxprvpjvv39945-5000.app.github.dev/generate_readme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate README')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Failed to read response')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = new TextDecoder().decode(value)
        if (chunk.startsWith("Cloning repository...")) {
          setProgress(prev => [...prev, "Cloning repository"])
        } else if (chunk.startsWith("Analyzing repository...")) {
          setProgress(prev => [...prev, "Analyzing repository"])
        } else if (chunk.startsWith("Generating README...")) {
          setProgress(prev => [...prev, "Generating README"])
        } else {
          setReadmeContent(prev => prev + chunk)
        }
      }
    } catch (err) {
      setError('An error occurred while generating the README. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <Card className="w-full max-w-4xl bg-white backdrop-blur-md shadow-2xl border border-gray-200">
        <CardHeader className="space-y-1 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-3xl font-bold">AI GitHub README Generator</CardTitle>
          <CardDescription className="text-gray-100 text-lg">
            Transform your repo into a stunning README with AI magic!
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Github className="text-gray-500 w-6 h-6" />
              <Input
                type="url"
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                required
                className="flex-grow border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-lg"
              />
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating
                  </>
                ) : (
                  'Generate README'
                )}
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {(isLoading || progress.length > 0) && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Progress</h3>
              <ul className="space-y-2">
                {['Cloning repository', 'Analyzing repository', 'Generating README'].map((step, index) => (
                  <li key={step} className="flex items-center">
                    {progress.includes(step) ? (
                      <Check className="mr-2 h-5 w-5 text-green-500" />
                    ) : (
                      <div className="mr-2 h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={progress.includes(step) ? 'text-green-700' : 'text-gray-500'}>
                      {step}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {readmeContent && (
            <div className="mt-8 space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Generated README</h2>
                <div className="relative">
                  <Textarea
                    value={readmeContent}
                    readOnly
                    className="w-full h-96 font-mono text-sm bg-gray-50 border-gray-300 text-gray-800 rounded-md"
                  />
                  <Button
                    onClick={() => navigator.clipboard.writeText(readmeContent)}
                    className="absolute top-2 right-2 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                  >
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">GitHub Preview</h2>
                <GitHubMarkdownPreview content={readmeContent} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
