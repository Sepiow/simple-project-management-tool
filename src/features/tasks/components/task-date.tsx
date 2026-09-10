import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface TaskDateProps {
  value: string | Date | undefined
  className?: string
}

export const TaskDate = ({ value, className }: TaskDateProps) => {
  if (!value) return <span className="text-xs text-muted-foreground">-</span>

  const date = new Date(value)

  return (
    <div className="text-muted-foreground">
      <span className={cn("text-xs truncate", className)}>
        {format(date, "PPP")}
      </span>
    </div>
  )
}