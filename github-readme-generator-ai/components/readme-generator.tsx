'use client'

import { useState, useEffect } from 'react'
import { Github, Loader2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { GitHubMarkdownPreview } from './github-markdown-preview'
import { io, Socket } from "socket.io-client"

const socket: Socket = io("https://urban-fiesta-457xw74wv7r2q4ww-5000.app.github.dev/") // Update with your backend URL

export function ReadmeGenerator() {
  const [repoUrl, setRepoUrl] = useState('')
  const [userRequirements, setUserRequirements] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedReadme, setGeneratedReadme] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    socket.on("readme_section", (data: { readme_content: string, file_name: string }) => {
      setGeneratedReadme((prev) => prev + `\n\n# ${data.file_name}\n\n${data.readme_content}`)
    })

    socket.on("error", (err: { message: string }) => {
      console.error(err.message)
      setIsLoading(false)
    })

    socket.on("readme_generation_complete", () => {
      setIsLoading(false)
    })

    return () => {
      socket.off("readme_section")
      socket.off("error")
      socket.off("readme_generation_complete")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!repoUrl) return

    setIsLoading(true)
    setGeneratedReadme('')

    socket.emit("generate_readme", { repoUrl, userRequirements })
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedReadme)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-white">
          Create Professional READMEs
        </h1>
        <p className="text-xl text-gray-400">
          Generate comprehensive README files for your GitHub repositories using AI
        </p>
      </div>

      <Card className="p-6 bg-[#161b22] border-[#30363d]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Github className="h-5 w-5 text-gray-500" />
              </div>
              <Input
                type="url"
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="pl-10 bg-[#0d1117] border-[#30363d] text-black placeholder:text-gray-500"
              />
            </div>
          </div>
          <Textarea
            placeholder="Enter any special requirements for your README (optional)"
            value={userRequirements}
            onChange={(e) => setUserRequirements(e.target.value)}
            className="bg-[#0d1117] border-[#30363d] text-white placeholder:text-gray-500"
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate README'
            )}
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#161b22] border-[#30363d] p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Generated Markdown</h2>
            {generatedReadme && (
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="text-gray-300 border-gray-600 hover:bg-gray-700"
              >
                {isCopied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <><Copy className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 h-[500px] overflow-auto">
            <pre className="text-left whitespace-pre-wrap text-sm text-gray-300 font-mono">
              {generatedReadme || "Your generated README will appear here..."}
            </pre>
          </div>
        </Card>
        <Card className="bg-[#161b22] border-[#30363d] p-4">
          <h2 className="text-xl font-semibold text-white mb-4">Preview</h2>
          <div className="bg-white rounded-lg p-4 h-[500px] overflow-auto">
            <GitHubMarkdownPreview content={generatedReadme || "# Preview\n\nYour README preview will appear here..."} />
          </div>
        </Card>
      </div>
    </div>
  )
}

