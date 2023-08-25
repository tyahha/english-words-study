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
}

type CorrectHistory = {
  isCorrect: boolean
  datetime: number
}

type CorrectHistories = Record<string, CorrectHistory[]>

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
  const histories = loadHistories(questionType)
  const history = histories[data.id] || []
  history.push({ isCorrect, datetime: Date.now() })
  histories[data.id] = history
  localStorage.setItem(
    keys[questionType].answerHistory,
    JSON.stringify(histories),
  )
}

let histories: CorrectHistories | undefined
export const loadHistories = (questionType: QuestionType): CorrectHistories => {
  if (histories) return histories

  const str = localStorage.getItem(keys[questionType].answerHistory)
  histories = (str ? JSON.parse(str) : {}) as CorrectHistories
  return histories
}

export const getHistory = (
  data: WordDataType,
  questionType: QuestionType,
): CorrectHistory[] => {
  const current = loadHistories(questionType)
  return current[data.id] || []
}

export const loadLastAnsweredId = (
  questionType: QuestionType,
): string | null => {
  return localStorage.getItem(keys[questionType].lastAnswer)
}

export const getTodayStudyCount = (questionType: QuestionType): number => {
  const today = dayjs().format("YYYYMMDD")
  return Object.values(loadHistories(questionType)).reduce((p, h) => {
    return (
      p +
      (h.find((h) => dayjs(h.datetime).format("YYYYMMDD") === today) ? 1 : 0)
    )
  }, 0)
}
