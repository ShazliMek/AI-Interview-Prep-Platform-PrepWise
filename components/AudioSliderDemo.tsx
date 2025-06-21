"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

type SliderProps = React.ComponentProps<typeof Slider>

export function AudioSliderDemo({ className, ...props }: SliderProps) {
  const [progress, setProgress] = React.useState([30])

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500">Audio Scrubber Demo</div>
      <Slider
        value={progress}
        onValueChange={setProgress}
        max={100}
        step={1}
        className={cn("w-full", className)}
        {...props}
      />
      <div className="text-xs text-gray-400">
        Progress: {progress[0]}%
      </div>
    </div>
  )
}
