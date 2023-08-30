import { useEffect, useRef } from "react"
import { Canvas } from "fabric"
import { clearCanvas, redoCanvas, setCanvas, undoCanvas } from "@/logics/canvas"

export const DrawArea = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new Canvas(canvasRef.current, {
      isDrawingMode: true,
      width: wrapperRef.current?.clientWidth || 0,
      height: 200,
    })
    setCanvas(canvas)

    if (!wrapperRef.current) return
    const resizeObserver = new ResizeObserver(() => {
      canvas.setWidth(wrapperRef.current?.clientWidth || window.innerWidth)
    })
    resizeObserver.observe(wrapperRef.current)

    return () => {
      resizeObserver.disconnect()
      clearCanvas()
    }
  }, [])

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <canvas ref={canvasRef} />
      <div className="flex gap-2 absolute top-2 right-2">
        <button
          className="px-2 py-1 rounded bg-gray-300 text-red-700 text-4xl"
          onClick={undoCanvas}
        >
          ←
        </button>
        <button
          className="px-2 py-1 rounded bg-gray-300 text-red-700 text-4xl"
          onClick={redoCanvas}
        >
          →
        </button>
        <button
          className="px-2 py-1 rounded bg-gray-300 text-red-700 text-4xl"
          onClick={clearCanvas}
        >
          ✖
        </button>
      </div>
    </div>
  )
}
