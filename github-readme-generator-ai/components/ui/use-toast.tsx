import React, { useState, useEffect } from 'react'

interface ToastProps {
  title: string
  description: string
  variant?: 'default' | 'destructive'
}

export const Toast: React.FC<ToastProps> = ({ title, description, variant = 'default' }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`rounded-md p-4 shadow-lg ${
        variant === 'destructive' ? 'bg-red-600' : 'bg-green-600'
      }`}>
        <div className="flex items-start">
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-white">{title}</p>
            <p className="mt-1 text-sm text-white">{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts((prevToasts) => [...prevToasts, props])
  }

  return { toast, Toasts: () => (
    <>
      {toasts.map((t, i) => (
        <Toast key={i} {...t} />
      ))}
    </>
  )}
}

