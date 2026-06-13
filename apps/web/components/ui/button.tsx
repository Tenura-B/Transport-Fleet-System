import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default: "bg-white text-black hover:bg-gray-100",
      primary: "bg-gradient-to-r from-orange-400 to-rose-400 text-black font-semibold hover:opacity-90",
      outline: "border-2 border-white/20 text-white hover:bg-white/10",
      ghost: "text-white hover:bg-white/10",
    }

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    }

    return (
      <button
        ref={ref}
        className={`rounded-full font-medium transition-all duration-300 ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
