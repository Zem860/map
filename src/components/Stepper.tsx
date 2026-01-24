import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import type { StepperProps } from "@/type/cart"

export function Stepper({ currentStep, className }: StepperProps) {
  const stepperContent = useCartStore((state) => state.stepperContent);
  return (
    <>
    <div className={cn("w-full bg-primary py-6 px-4", className)}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Connection line */}
          <div className="absolute left-0 right-0 top-6 h-0.5 bg-primary/60" />

          {stepperContent.map((step, index) => {
            const stepNumber = index + 1
            const isActive = stepNumber === currentStep
            const isCompleted = stepNumber < currentStep

            return (
              <div key={index} className="flex flex-col items-center relative z-10 flex-1">
                {/* Step circle */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-colors mb-3",
                    isCompleted
                      ? "bg-white text-primary"
                      : isActive
                        ? "bg-white text-primary"
                        : "bg-primary/60 text-primary-foreground/60",
                  )}
                >
                  {isCompleted ? <Check className="w-6 h-6" /> : stepNumber}
                </div>

                {/* Step title */}
                <div
                  className={cn(
                    "text-center text-sm font-medium transition-colors",
                    isActive ? "text-primary-foreground" : "text-primary-foreground/80",
                  )}
                >
                  {step.title}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div></>
  )
}
