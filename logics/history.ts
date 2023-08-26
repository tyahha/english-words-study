"use client"

import dayjs from "dayjs"
import { QuestionType, WordDataType } from "@/data/wordsData"

type Keys = {
  answerHistory: string
  lastAnswer: string
}

const keys: Record<QuestionType, Keys> = <const>{
  J2E: {
    answerHistory: "english-study-history-j2e",
    lastAnswer: "english-study-last-answer-j2e",
  },
  E2J: {
    answerHistory: "english-study-history-e2j",
    lastAnswer: "english-study-last-answer-e2j",
  },
  listening: {
    answerHistory: "english-study-history-listening",
    lastAnswer: "english-study-last-answer-listening",
  },
}

type CorrectHistory = {
  isCorrect: boolean
  datetime: number
}

type CorrectHistories = Record<string, CorrectHistory[]>

type CorrectHistoriesByQuestionType = Record<QuestionType, CorrectHistories>
export const saveHistory = (
  questionType: QuestionType,
  data: WordDataType,
  isCorrect: boolean,
) => {
  saveHistoryAtReview(questionType, data, isCorrect)
  localStorage.setItem(keys[questionType].lastAnswer, data.id)
}

export const saveHistoryAtReview = (
  questionType: QuestionType,
  data: WordDataType,
  isCorrect: boolean,
) => {
  const histories = loadHistories()[questionType]
  const history = histories[data.id] || []
  history.push({ isCorrect, datetime: Date.now() })
  histories[data.id] = history
  localStorage.setItem(
    keys[questionType].answerHistory,
    JSON.stringify(histories),
  )
}

let histories: CorrectHistoriesByQuestionType | undefined
export const loadHistories = (): CorrectHistoriesByQuestionType => {
  if (histories) return histories

  const load = (questionType: QuestionType) => {
    const str = localStorage.getItem(keys[questionType].answerHistory)
    return (str ? JSON.parse(str) : {}) as CorrectHistories
  }

  histories = {
    J2E: load("J2E"),
    E2J: load("E2J"),
    listening: load("listening"),
  }
  return histories
}
export const loadHistoriesByType = (
  questionType: QuestionType,
): CorrectHistories => loadHistories()[questionType]

export const getHistory = (
  data: WordDataType,
  questionType: QuestionType,
): CorrectHistory[] => {
  const current = loadHistoriesByType(questionType)
  return current[data.id] || []
}

export const loadLastAnsweredId = (
  questionType: QuestionType,
): string | null => {
  return localStorage.getItem(keys[questionType].lastAnswer)
}

export const getTodayStudyCountByType = (
  questionType: QuestionType,
): number => {
  const today = dayjs().format("YYYYMMDD")
  return Object.values(loadHistoriesByType(questionType)).reduce((p, h) => {
    return (
      p +
      (h.find((h) => dayjs(h.datetime).format("YYYYMMDD") === today) ? 1 : 0)
    )
  }, 0)
}

export const getTodayStudyCount = (): Record<QuestionType, number> => ({
  J2E: getTodayStudyCountByType("J2E"),
  E2J: getTodayStudyCountByType("E2J"),
  listening: getTodayStudyCountByType("listening"),
})
