import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { repoUrl } = await req.json()

  const response = await fetch('https://readme-generator-qe85.onrender.com/generate_readme', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ repoUrl }),
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to generate README' }, { status: 500 })
  }

  const reader = response.body?.getReader()
  const stream = new ReadableStream({
    async start(controller) {
      while (true) {
        const { done, value } = await reader!.read()
        if (done) break
        controller.enqueue(value)
      }
      controller.close()
    },
  })

  return new NextResponse(stream)
}

