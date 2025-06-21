"use client"

import { Slider } from "@/components/ui/slider"

export default function TestSliderPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Slider Test</h1>
      <div className="w-full max-w-md">
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          className="w-full"
        />
      </div>
      <p className="mt-4 text-sm text-gray-500">
        If you can see a slider above, the component is working.
      </p>
    </div>
  )
}
