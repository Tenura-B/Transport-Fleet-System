import * as React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = ({ className, ...props }: CardProps) => (
  <div
    className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl ${className}`}
    {...props}
  />
)

Card.displayName = "Card"
