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
  disabled?: boolean
}

export function DateTimePicker({
  date,
  time = "10:30:00",
  onDateChange,
  onTimeChange,
  className = "",
  disabled = false
}: DateTimePickerProps) {

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onDateChange?.(undefined);
      return;
    }

    const normalizedDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      12,
      0,
      0,
      0
    );

    onDateChange?.(normalizedDate);
  };

  return (
    <div className={`flex gap-4 ${className}`}>
      {/* Date picker */}
      <div className="flex-1">
        <DatePicker
          label=""
          minDate={new Date(1900, 0, 1)}
          onChange={handleDateChange}
          selected={date}
          disabled={disabled}
        />
      </div>

      {/* Time picker */}
      <div className="flex-1">
        <Input
          type="time"
          id="time-picker"
          disabled={disabled}
          step="1"
          value={time}
          onChange={(e) => onTimeChange?.(e.target.value)}
          className="w-full bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}