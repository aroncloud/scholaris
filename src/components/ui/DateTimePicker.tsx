"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { DatePicker } from "../DatePicker";

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

  return (
    <div className={`flex gap-4 ${className}`}>
      {/* Date picker */}
      <div className="flex-1">
        
        <DatePicker
          label=""
          minDate={new Date(1900, 0, 1)}
          onChange={(selectedDate) => {
            onDateChange?.(selectedDate);
          }}
          selected={date}
        />
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
