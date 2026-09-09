"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: Date | string | undefined // 👈 Accepts both Date and string
  onChange: (date: Date) => void
  className?: string
  placeholder?: string
}

export const DatePicker = ({
  value,
  onChange,
  className,
  placeholder = "Select date"
}: DatePickerProps) => {
  const dateValue = value ? new Date(value) : undefined // 👈 Safely converts to Date

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "w-full justify-start text-left font-normal px-3",
              !dateValue && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateValue ? format(dateValue, "PPP") : <span>{placeholder}</span>}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={(date) => date && onChange(date)}
        />
      </PopoverContent>
    </Popover>
  )
}