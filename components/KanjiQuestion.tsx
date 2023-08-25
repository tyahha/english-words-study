import { Kanji, KanjiDataCategories } from "@/data/kanji"
import { useEffect, useMemo, useState } from "react"
import { getTodayStudyCount, saveHistory, saveHistoryAtReview } from "@/logics/history"
import { useAppContext } from "@/context"
import { Histories } from "@/components/Histories"
import { DrawArea } from "@/components/DrawArea"
import { Shippori_Mincho_B1 } from "@next/font/google"

const font = Shippori_Mincho_B1({ weight: "400", subsets: ["latin"] })

type Props = {
  data: Kanji
  onPrev: () => void
  onNext: () => void
  onReturnTitle: () => void
}
export const KanjiQuestion = ({ data, onPrev, onNext, onReturnTitle }: Props) => {
  const { mode } = useAppContext()

  const [s1, s2] = data.sentence.split(data.kanji)
  const [status, setStatus] = useState<"thinking" | "result">("thinking")
  const word = useMemo(() => {
    return status === "thinking"
      ? data.questionType === "write"
        ? data.kana
        : data.kanji
      : data.questionType === "write"
      ? data.kanji
      : data.kana
  }, [status, data])

  const [todayStudyCount, setTodayStudyCount] = useState(getTodayStudyCount())
  useEffect(() => {
    setTodayStudyCount(getTodayStudyCount())
  }, [data])

  const saveResult = (isCollect: boolean) => {
    if (mode === "review") {
      saveHistoryAtReview(data, isCollect)
    } else {
      saveHistory(data, isCollect)
    }
    setStatus("thinking")
    onNext()
  }

  const { questions } = useAppContext()
  const index = useMemo(() => questions.findIndex((q) => q.id === data.id), [data, questions])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (status === "thinking") {
          if (e.shiftKey) {
            onPrev()
          } else {
            setStatus("result")
          }
        } else {
          if (e.shiftKey) {
            setStatus("thinking")
          } else {
            setStatus("thinking")
            onNext()
          }
        }
      }
    }
    window.addEventListener("keydown", handler)

    return () => {
      window.removeEventListener("keydown", handler)
    }
  }, [status, onPrev, onNext])

  const idPrefix = useMemo(() => {
    return data.id.split("-")[0]
  }, [data])

  const [category, categoryIndex] = useMemo(() => {
    const index = KanjiDataCategories.findIndex((c) => c.idPrefix === idPrefix)
    return [KanjiDataCategories[index], index]
  }, [idPrefix])

  return (
    <main
      className={`flex justify-center  ${categoryIndex % 2 === 0 ? "bg-blue-100" : "bg-red-100"}`}
    >
      <section className="w-11/12 text-center">
        <div className="mt-4 flex gap-8 justify-center">
          <button
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            onClick={() => {
              setStatus("thinking")
              onPrev()
            }}
          >
            ＜＜＜前に戻る
          </button>
          <button
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            onClick={onReturnTitle}
          >
            タイトルに戻る
          </button>
          <button
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            onClick={() => {
              setStatus("thinking")
              onNext()
            }}
          >
            次に進む＞＞＞
          </button>
        </div>
        <p className="text-5xl text-center mt-4">
          {category.idPrefix}. {category.title}
        </p>
        <p className="text-xl text-center mt-4">今日勉強した漢字数：{todayStudyCount}</p>
        <h2 className="text-center text-6xl my-4">
          問題{data.id}({index + 1}/{questions.length})
        </h2>
        <div className="mt-4">
          <div className="flex gap-4 justify-center mt-4">
            <button
              disabled={status !== "result"}
              className={`bg-green-500 text-white font-bold py-4 w-1/2 text-4xl rounded ${
                status === "result" ? "hover:bg-green-700" : "opacity-50"
              }`}
              onClick={() => saveResult(true)}
            >
              ◎あたった
            </button>
            <button
              disabled={status !== "result"}
              className={`bg-red-500 text-white font-bold py-4 w-1/2 text-4xl rounded ${
                status === "result" ? "hover:bg-red-700" : "opacity-50"
              }`}
              onClick={() => saveResult(false)}
            >
              ✖はずれた
            </button>
          </div>
          <button
            className={`bg-blue-500 text-white font-bold py-4 rounded text-4xl w-1/2 mt-4 ${
              status === "thinking" ? "hover:bg-blue-700" : "opacity-50"
            }`}
            onClick={() => setStatus("result")}
            disabled={status !== "thinking"}
          >
            答えを見る
          </button>
        </div>
        <p className={`bg-gray-100 text-center py-16 my-4 ${font.className}`}>
          <span className="text-6xl">{s1} </span>
          <span className="font-bold underline text-6xl underline-offset-[8px]">{word}</span>
          <span className="text-6xl"> {s2}</span>
        </p>
        <div className="flex justify-center mt-4 bg-white">
          <DrawArea />
        </div>
        <div className="relative overflow-x-auto shadow-md mt-8 w-fit m-auto min-w-8">
          <Histories kanji={data} />
        </div>
      </section>
    </main>
  )
}
