import { Canvas, PencilBrush } from "fabric"

let canvas: Canvas | null = null
let canvasHistory: string[] = []
let historyIndex = 0
let isLockHistory = false

export const setCanvas = (c: Canvas) => {
  if (canvas) cleanCanvas()

  canvas = c

  const brash = new PencilBrush(canvas)
  brash.width = 3
  brash.color = "#666"
  canvas.freeDrawingBrush = brash

  clearCanvas()

  canvas.on("object:added", addCanvasHistory)
  canvas.on("object:modified", addCanvasHistory)
}

export const cleanCanvas = () => {
  if (canvas) canvas.dispose()
  canvas = null
}

const addCanvasHistory = () => {
  if (!canvas || isLockHistory) return
  historyIndex++
  canvasHistory = [...canvasHistory.slice(0, historyIndex), JSON.stringify(canvas)]
}

export const clearCanvas = () => {
  canvas?.clear()
  addCanvasHistory()
}

export const clearCanvasWithHistory = () => {
  clearCanvas()

  if (!canvas) return
  historyIndex = 0
  canvasHistory = [JSON.stringify(canvas)]
}

const loadHistoryByIndex = async (index: number) => {
  if (!canvas) return

  if (index < 0 || canvasHistory.length <= index) return

  historyIndex = index
  const content = canvasHistory[historyIndex]
  isLockHistory = true

  await canvas.loadFromJSON(content)

  isLockHistory = false
  canvas.renderAll()
}

export const undoCanvas = async () => {
  await loadHistoryByIndex(historyIndex - 1)
}

export const redoCanvas = async () => {
  await loadHistoryByIndex(historyIndex + 1)
}
