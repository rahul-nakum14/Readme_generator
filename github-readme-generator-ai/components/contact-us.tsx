import React, { useState, useEffect } from 'react'
import { Modal } from './ui/modal'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'
import { io, Socket } from "socket.io-client"

interface ContactUsProps {
  isOpen: boolean
  onClose: () => void
}

export const ContactUs: React.FC<ContactUsProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [socket, setSocket] = useState<Socket | null>(null)
  
  useEffect(() => {
    const newSocket = io("https://urban-fiesta-457xw74wv7r2q4ww-5000.app.github.dev/")
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!socket) return

    socket.on("contact_form_response", (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast({
          title: "Message Sent",
          description: data.message,
        })
        onClose()
        setTitle('')
        setDescription('')
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        })
      }
      setIsSubmitting(false)
    })

    return () => {
      socket.off("contact_form_response")
    }
  }, [socket, toast, onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "Message Sent",
            description: "Your message has been sent successfully.",
          })
          onClose()
          setTitle('')
          setDescription('')
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to send message.",
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        })
      })
      .finally(() => setIsSubmitting(false))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Us">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="bg-[#0d1117] border-[#30363d] text-black"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="bg-[#0d1117] border-[#30363d] text-white"
            rows={4}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Modal>
  )
}
