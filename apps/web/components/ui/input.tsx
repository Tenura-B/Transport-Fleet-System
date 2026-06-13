import * as React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`w-full px-4 py-3 bg-black/30 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all duration-300 ${className}`}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"
