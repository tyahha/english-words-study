import { createContext, useContext } from "react"
import { Kanji } from "@/data/kanji"

export type Mode = "title" | "question" | "review"

export const AppContext = createContext<{
  index: number
  setIndex: (i: number) => void
  questions: Kanji[]
  setQuestions: (q: Kanji[]) => void
  mode: Mode
  setMode: (mode: Mode) => void
}>({
  index: 0,
  setIndex: () => {},
  questions: [],
  setQuestions: () => {},
  mode: "title",
  setMode: () => {},
})

export const useAppContext = () => useContext(AppContext)
