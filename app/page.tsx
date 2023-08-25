"use client"

import { TitleView } from "@/components/Title"
import { useState } from "react"
import { QuestionView } from "@/components/QuestionView"
import { Kanji } from "@/data/kanji"
import { AppContext, Mode } from "@/context"
import dayjs from "dayjs"
import "dayjs/locale/ja"
dayjs.locale("ja")

export default function Home() {
  const [mode, setMode] = useState<Mode>("title")
  const [index, setIndex] = useState(0)
  const [questions, setQuestions] = useState<Kanji[]>([])

  return (
    <AppContext.Provider
      value={{
        index,
        setIndex,
        questions,
        setQuestions,
        mode,
        setMode,
      }}
    >
      {mode === "title" ? <TitleView /> : <QuestionView />}
    </AppContext.Provider>
  )
}
