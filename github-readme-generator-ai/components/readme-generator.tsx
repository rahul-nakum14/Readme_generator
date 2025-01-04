'use client'

import { useState, useEffect, FormEvent } from "react"
import { io, Socket } from "socket.io-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Github, Loader2, CheckCircle } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { GitHubMarkdownPreview } from './github-markdown-preview'

const socket: Socket = io("https://fantastic-fishstick-p4rxprvpjvv39945-5000.app.github.dev/") // Update backend URL

export default function AIReadmeGenerator() {
  const [repoUrl, setRepoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [readmeContent, setReadmeContent] = useState("")
  const [progress, setProgress] = useState<string[]>([])
  const [error, setError] = useState("")
useEffect(() => {

    socket.on("readme_section", (data: { readme_content: string }) => {
        if (data?.readme_content) {
            setReadmeContent((prev) => prev + data.readme_content)
        } else {
            setError("Invalid data received from server.")
        }
    })

    socket.on("progress", (status: { status: string }) => {
        if (status?.status) {
            if (status.status === "README generation complete!") {
                setIsLoading(false)
            } else {
                setProgress((prev) => [...prev, status.status])
            }
        } else {
            setError("Invalid progress data received from server.")
        }
    })

    socket.on("error", (err: { message: string }) => {
        setError(err.message || "An unknown error occurred.")
        setIsLoading(false)
    })

    return () => {
        socket.disconnect()
    }
}, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!repoUrl.trim()) {
      setError("Please enter a valid GitHub repository URL")
      return
    }

    setIsLoading(true)
    setReadmeContent("")
    setProgress([])
    setError("")

    socket.emit("generate_readme", { repoUrl })
  }

  return (
    <div className="min-h-screen p-8 bg-[#0d1117] flex items-center justify-center">
      <Card className="w-full max-w-5xl bg-[#161b22] border-[#30363d] p-6">
        <h1 className="text-4xl font-bold text-white text-center">AI GitHub README Generator</h1>
        <p className="text-gray-400 text-center mt-2">
          Transform your GitHub repository into a stunning README file with AI-powered magic!
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Github className="w-5 h-5 text-gray-500" />
              </div>
              <Input
                type="url"
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="pl-10 bg-[#0d1117] border-[#30363d] text-black placeholder-gray-500"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate README"
              )}
            </Button>
          </div>
        </form>
        {error && <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
        {progress.length > 0 && (
          <ul className="mt-4 space-y-2">
            {progress.map((step, index) => (
              <li key={index} className="flex items-center space-x-2 text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <Card className="p-6 bg-[#161b22] border-[#30363d]" >
  <h2 className="text-xl font-semibold text-white mb-4">Generated Markdown</h2>
  <Textarea
    value={readmeContent}
    readOnly
    className="w-full h-96 font-mono text-sm bg-[#0d1117] border-[#30363d] text-gray-300"
    placeholder="Your generated README will appear here..."
  />
</Card>
<Card className="p-6 bg-[#161b22] border-[#30363d]">
  <h2 className="text-xl font-semibold text-white mb-4">Preview</h2>
  <div className="bg-white rounded-lg p-4 h-96 overflow-auto">
    <GitHubMarkdownPreview content={readmeContent || "# Preview\n\nYour README preview will appear here..."} />
  </div>
</Card>

        </div>
      </Card>
    </div>
  )
}
