"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { PopoverPortal } from "@radix-ui/react-popover"

type DatePickerProps = {
  label?: string
  defaultDate?: Date
  minDate?: Date
  maxDate?: Date
  onChange?: (date: Date | undefined) => void
  disabled?: boolean
  selected?: Date
}

export function DatePicker({
  label = "Select date",
  defaultDate,
  minDate,
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
  onChange,
  disabled,
  selected
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  
  const [date, setDate] = React.useState<Date | undefined>(defaultDate)

  React.useEffect(() => {
    setDate(selected)
  }, [selected])

  const handleSelect = (selectedDate: Date | undefined) => {
    // Normalize the date to noon local time to avoid timezone issues
    // when converting to ISO string
    let normalizedDate = selectedDate
    if (selectedDate) {
      normalizedDate = new Date(selectedDate)
      normalizedDate.setHours(12, 0, 0, 0)
    }

    setDate(normalizedDate)
    if (onChange) onChange(normalizedDate)
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <Label htmlFor="date" className="px-1">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full gap justify-start font-normal py-4 overflow-hidden"
          >
            <CalendarIcon className="mr-2 h-4 w-4 mb-1" />
            {date ? date.toLocaleDateString() : "Sélectionner une date"}
          </Button>
        </PopoverTrigger>
        {/* 2. Envelopper PopoverContent avec PopoverPortal */}
        <PopoverPortal>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            startMonth={minDate}
            endMonth={new Date(maxDate.getFullYear(), maxDate.getMonth())}
            captionLayout="dropdown"
            disabled={disabled}
            
          />
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    </div>
  )
}