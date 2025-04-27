import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function GitHubMarkdownPreview({ content }: { content: string }) {
  return (
    <div className="github-markdown-preview">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}

