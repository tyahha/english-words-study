import { useAppContext } from "@/context"
import { Kanji, KanjiData, KanjiDataCategories } from "@/data/kanji"
import { useEffect, useMemo, useState } from "react"
import { getTodayStudyCount, loadHistories, loadLastAnsweredId } from "@/logics/history"
import dayjs from "dayjs"
import { defaultAppSettings, loadSettings, saveSettings } from "@/logics/settings"

const pickWrongs = (day: dayjs.Dayjs) => {
  const histories = loadHistories()
  const ret: Kanji[] = []
  const baseDay = day.format("YYYYMMDD")
  Object.entries(histories).forEach(([id, history]) => {
    const kanji = KanjiData.find((k) => k.id === id)
    if (
      kanji &&
      history.find((h) => !h.isCorrect && dayjs(h.datetime).format("YYYYMMDD") === baseDay)
    ) {
      ret.push(kanji)
    }
  })
  return ret
}

const pickRecentWrongs = (day: dayjs.Dayjs) => {
  const histories = loadHistories()
  const ret: Kanji[] = []
  const baseDay = day.format("YYYYMMDD")
  Object.entries(histories).forEach(([id, history]) => {
    const kanji = KanjiData.find((k) => k.id === id)
    if (
      kanji &&
      history.length > 0 &&
      !history[history.length - 1].isCorrect &&
      baseDay === dayjs(history[history.length - 1].datetime).format("YYYYMMDD")
    ) {
      ret.push(kanji)
    }
  })
  return ret
}

export const TitleView = () => {
  const { setMode, setQuestions, setIndex } = useAppContext()
  const [{ isOnlyWrongs, enableWrongsCount, selectedCategoryIdPrefix }, setSettings] =
    useState(defaultAppSettings)
  useEffect(() => {
    setSettings(loadSettings())
  }, [])
  const setIsOnlyWrongs = (v: boolean) => {
    setSettings((s) => {
      const n = {
        ...s,
        isOnlyWrongs: v,
      }
      saveSettings(n)
      return n
    })
  }
  const setEnabledWrongsCount = (v: number) => {
    setSettings((s) => {
      const n = {
        ...s,
        enableWrongsCount: v,
      }
      saveSettings(n)
      return n
    })
  }
  const setCategoryIndex = (v: number) => {
    setSettings((s) => {
      const n = {
        ...s,
        selectedCategoryIdPrefix: KanjiDataCategories[v].idPrefix,
      }
      saveSettings(n)
      return n
    })
  }
  const categoryIndex = useMemo(() => {
    const index = KanjiDataCategories.findIndex((c) => c.idPrefix === selectedCategoryIdPrefix)
    return index < 0 ? 0 : index
  }, [selectedCategoryIdPrefix])
  const [
    {
      indexForContinue,
      recentWrongs,
      todayWrongs,
      yesterdayWrongs,
      twoDaysAgoWrongs,
      todayStudyCount,
    },
    setState,
  ] = useState<{
    indexForContinue: number
    recentWrongs: Kanji[]
    todayWrongs: Kanji[]
    yesterdayWrongs: Kanji[]
    twoDaysAgoWrongs: Kanji[]
    todayStudyCount: number
  }>({
    indexForContinue: 0,
    recentWrongs: [],
    todayWrongs: [],
    yesterdayWrongs: [],
    twoDaysAgoWrongs: [],
    todayStudyCount: 0,
  })
  useEffect(() => {
    const id = loadLastAnsweredId() || KanjiData[0].id
    const foundIndex = KanjiData.findIndex((k) => k.id === id)
    const continueIndex = foundIndex == null ? 0 : foundIndex + 1
    console.log("continueIndex", continueIndex)
    setState({
      indexForContinue: KanjiData.length <= continueIndex ? 0 : continueIndex,
      recentWrongs: pickRecentWrongs(dayjs()),
      todayWrongs: pickWrongs(dayjs()),
      yesterdayWrongs: pickWrongs(dayjs().subtract(1, "day")),
      twoDaysAgoWrongs: pickWrongs(dayjs().subtract(2, "day")),
      todayStudyCount: getTodayStudyCount(),
    })
  }, [])
  const filteredKanjiData = useMemo(() => {
    if (!isOnlyWrongs) return KanjiData

    return KanjiData.filter((k) => {
      const history = loadHistories()
      const h = history[k.id]
      if (!h) return false

      return h.filter((e) => !e.isCorrect).length >= enableWrongsCount
    })
  }, [isOnlyWrongs, enableWrongsCount])

  return (
    <main className="mt-16">
      <h1 className="text-9xl text-center">漢字の勉強</h1>
      <h2 className="text-center mt-12 text-4xl">
        毎日の学習(本日勉強した漢字の数：{todayStudyCount})
      </h2>
      <div className="text-center mt-4 text-xl">
        <span className="p-2 bg-blue-300">
          <input
            className="mr-2"
            id="isOnlyWrongs"
            type="checkbox"
            checked={isOnlyWrongs}
            onChange={(e) => setIsOnlyWrongs(e.target.checked)}
          />
          <select
            value={enableWrongsCount}
            onChange={(e) => setEnabledWrongsCount(Number(e.target.value))}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <label htmlFor="isOnlyWrongs">回以上間違えたところだけ</label>
        </span>
      </div>
      <div className="flex justify-center gap-1 mt-4">
        <button
          onClick={() => {
            setQuestions(filteredKanjiData)
            setIndex(0)
            setMode("question")
          }}
          disabled={filteredKanjiData.length <= 0}
          className={`bg-blue-500 text-white font-bold py-4 rounded text-2xl w-1/4 ${
            filteredKanjiData.length <= 0 ? "opacity-50" : "hover:bg-blue-700"
          }`}
        >
          初めから
        </button>
        <button
          onClick={() => {
            setQuestions(filteredKanjiData)
            setIndex(indexForContinue)
            setMode("question")
          }}
          disabled={indexForContinue === 0 || filteredKanjiData.length <= 0}
          className={`bg-green-500 text-white font-bold py-4 rounded text-2xl w-1/4 ${
            indexForContinue === 0 || filteredKanjiData.length <= 0
              ? "opacity-50"
              : "hover:bg-green-700"
          }`}
        >
          続きから
        </button>
      </div>
      <div className="flex justify-center gap-1 mt-4">
        <button
          onClick={() => {
            const category = KanjiDataCategories[categoryIndex]
            const idToFind = `${category.idPrefix}-1`
            const index = filteredKanjiData.findIndex((k) => k.id === idToFind)
            setQuestions(filteredKanjiData)
            setIndex(index < 0 ? 0 : index)
            setMode("question")
          }}
          disabled={indexForContinue === 0 || filteredKanjiData.length <= 0}
          className={`bg-green-500 text-white font-bold py-4 rounded text-2xl w-1/4 ${
            indexForContinue === 0 || filteredKanjiData.length <= 0
              ? "opacity-50"
              : "hover:bg-green-700"
          }`}
        >
          選んで始める
        </button>
        <select
          className="text-xl text-center w-1/4"
          value={categoryIndex}
          onChange={(e) => setCategoryIndex(Number(e.target.value))}
        >
          {KanjiDataCategories.map((c, index) => (
            <option key={c.idPrefix} value={index}>
              {c.idPrefix}. {c.title}
            </option>
          ))}
        </select>
      </div>
      <h2 className="text-center mt-12 text-4xl">復習</h2>
      <div className="flex justify-center gap-1 mt-4">
        <button
          disabled={recentWrongs.length === 0}
          onClick={() => {
            setQuestions(recentWrongs)
            setIndex(0)
            setMode("review")
          }}
          className={`bg-green-500 text-white font-bold py-4 rounded text-2xl w-1/4 ${
            recentWrongs.length === 0 ? "opacity-50" : "hover:bg-green-700"
          }`}
        >
          直前に間違えたところ
        </button>
        <button
          disabled={todayWrongs.length === 0}
          onClick={() => {
            setQuestions(todayWrongs)
            setIndex(0)
            setMode("review")
          }}
          className={`bg-green-500 text-white font-bold py-4 rounded text-2xl w-1/4 ${
            todayWrongs.length === 0 ? "opacity-50" : "hover:bg-green-700"
          }`}
        >
          今日間違えたところ
        </button>
      </div>
      <div className="flex justify-center gap-1 mt-4">
        <button
          disabled={yesterdayWrongs.length === 0}
          onClick={() => {
            setQuestions(yesterdayWrongs)
            setIndex(0)
            setMode("review")
          }}
          className={`bg-green-500 text-white font-bold py-4 rounded text-2xl w-1/4 ${
            yesterdayWrongs.length === 0 ? "opacity-50" : "hover:bg-green-700"
          }`}
        >
          昨日間違えたところ
        </button>
        <button
          disabled={twoDaysAgoWrongs.length === 0}
          onClick={() => {
            setQuestions(twoDaysAgoWrongs)
            setIndex(0)
            setMode("review")
          }}
          className={`bg-green-500 text-white font-bold py-4 rounded text-2xl w-1/4 ${
            twoDaysAgoWrongs.length === 0 ? "opacity-50" : "hover:bg-green-700"
          }`}
        >
          一昨日間違えたところ
        </button>
      </div>
    </main>
  )
}
