import * as React from "react"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-xl border shadow-sm ${className}`}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

export { Card }