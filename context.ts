import { createContext, useContext } from "react"
import { QuestionType, WordDataType } from "@/data/wordsData"

export type Mode = "title" | "question" | "review"

export const AppContext = createContext<{
  index: number
  setIndex: (i: number) => void
  questions: WordDataType[]
  setQuestions: (q: WordDataType[]) => void
  mode: Mode
  setMode: (mode: Mode) => void
  questionType: QuestionType
  setQuestionType: (questionType: QuestionType) => void
}>({
  index: 0,
  setIndex: () => {},
  questions: [],
  setQuestions: () => {},
  mode: "title",
  setMode: () => {},
  questionType: "J2E",
  setQuestionType: () => {},
})

export const useAppContext = () => useContext(AppContext)
