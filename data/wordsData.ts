import { MaruttoWordsData } from "@/data/001_M_marutto"

export type WordDataType = {
  id: string
  japanese: string
  english: string
}

export type QuestionType = "J2E" | "E2J" | "listening"

export const WordsData: WordDataType[] = [...MaruttoWordsData]
