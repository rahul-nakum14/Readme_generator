import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  const { title, description } = await request.json()

  if (!title || !description) {
    return NextResponse.json({ success: false, error: "Title and description are required." }, { status: 400 })
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'hanonymous371@gmail.com',
      pass: 'dqhp wtwk flae shmv',
    },
  })

  try {
    const info = await transporter.sendMail({
      from: '"README Generator" <noreply@readmegenerator.com>',
      to: 'hanonymous371@gmail.com',
      subject: `New Contact Form Submission: ${title}`,
      text: description,
      html: `<p>${description}</p>`,
    })

    return NextResponse.json({ success: true, messageId: info.messageId })
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 })
  }
}
