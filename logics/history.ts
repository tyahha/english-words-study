"use client"

import { Kanji } from "@/data/kanji"
import dayjs from "dayjs"

const answerHistoryKey = "kanji-study-history-v2"
const lastAnswerKey = "kanji-study-last-answer"

type CorrectHistory = {
  isCorrect: boolean
  datetime: number
}

type KanjiCorrectHistories = Record<string, CorrectHistory[]>

export const saveHistory = (kanji: Kanji, isCorrect: boolean) => {
  saveHistoryAtReview(kanji, isCorrect)
  localStorage.setItem(lastAnswerKey, kanji.id)
}

export const saveHistoryAtReview = (kanji: Kanji, isCorrect: boolean) => {
  const histories = loadHistories()
  const history = histories[kanji.id] || []
  history.push({ isCorrect, datetime: Date.now() })
  histories[kanji.id] = history
  localStorage.setItem(answerHistoryKey, JSON.stringify(histories))
}

let histories: KanjiCorrectHistories | undefined
export const loadHistories = (): KanjiCorrectHistories => {
  if (histories) return histories

  const str = localStorage.getItem(answerHistoryKey)
  histories = (str ? JSON.parse(str) : {}) as KanjiCorrectHistories
  return histories
}

export const getHistory = (kanji: Kanji): CorrectHistory[] => {
  const current = loadHistories()
  return current[kanji.id] || []
}

export const loadLastAnsweredId = (): string | null => {
  return localStorage.getItem(lastAnswerKey)
}

export const getTodayStudyCount = (): number => {
  const today = dayjs().format("YYYYMMDD")
  return Object.values(loadHistories()).reduce((p, h) => {
    return p + (h.find((h) => dayjs(h.datetime).format("YYYYMMDD") === today) ? 1 : 0)
  }, 0)
}
