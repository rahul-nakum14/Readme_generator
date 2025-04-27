import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive' | 'link'
  size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-purple-600 text-white hover:bg-purple-700': variant === 'default',
            'bg-transparent border border-purple-600 text-purple-600 hover:bg-purple-100': variant === 'outline',
            'bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
            'text-purple-600 underline-offset-4 hover:underline': variant === 'link',
            'text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1': size === 'sm',
            'text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2': size === 'default',
            'text-base sm:text-lg px-4 py-2 sm:px-6 sm:py-3': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
