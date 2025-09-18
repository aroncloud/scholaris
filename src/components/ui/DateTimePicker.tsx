"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface DateTimePickerProps {
  date?: Date;
  time?: string; // format "HH:mm:ss"
  onDateChange?: (date: Date | undefined) => void;
  onTimeChange?: (time: string) => void;
  className?: string;
}

export function DateTimePicker({
  date,
  time = "10:30:00",
  onDateChange,
  onTimeChange,
  className = "",
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={`flex gap-4 ${className}`}>
      {/* Date picker */}
      <div className="flex-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-full justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <CalendarIcon />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(selectedDate) => {
                onDateChange?.(selectedDate);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time picker */}
      <div className="flex-1">
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={time}
          onChange={(e) => onTimeChange?.(e.target.value)}
          className="w-full bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
