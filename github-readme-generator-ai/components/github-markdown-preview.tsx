import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function GitHubMarkdownPreview({ content }: { content: string }) {
  return (
    <div className="github-markdown-preview bg-white border border-gray-200 rounded-md p-4 overflow-auto max-h-[600px]">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}

