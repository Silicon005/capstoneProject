"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarClock, Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export default function TimeSettings({ startTime, setStartTime, endTime, setEndTime, duration, setDuration }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex justify-end items-center mt-6"> {/* Use justify-end to align the button to the right */}
      <Button className="flex items-center" onClick={() => setIsOpen(true)}>
        <CalendarClock className="w-4 h-4 mr-2" /> Set Start & End Time
      </Button>

      {isOpen && (
        <div className="absolute top-20 right-10 w-80 bg-[#1E1E1E] dark:bg-[#1E1E1E] shadow-lg rounded-lg p-6 z-50 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Set Time</h3>

          {[
            { label: "Start Time", value: startTime, setValue: setStartTime },
            { label: "End Time", value: endTime, setValue: setEndTime },
          ].map(({ label, value, setValue }) => (
            <div key={label} className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-[240px] justify-start text-left font-normal", !value && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2" />
                    {value ? format(value, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={value} onSelect={setValue} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Duration (hours and minutes)</label>
            <div className="flex space-x-2">
              <Input
                type="number"
                className="w-1/2"
                value={Math.floor(duration / 60)}
                onChange={(e) => {
                  const hours = parseInt(e.target.value) || 0;
                  setDuration(hours * 60 + (duration % 60)); // Store in minutes
                }}
                min={0}
                placeholder="Hours"
              />
              <Input
                type="number"
                className="w-1/2"
                value={duration % 60}
                onChange={(e) => {
                  const minutes = parseInt(e.target.value) || 0;
                  setDuration((duration - (duration % 60)) + minutes); // Store in minutes
                }}
                min={0}
                placeholder="Minutes"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" className="bg-gray-700 text-white hover:bg-gray-600" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-500" onClick={() => setIsOpen(false)}>
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}