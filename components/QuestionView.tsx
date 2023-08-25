import { KanjiQuestion } from "@/components/KanjiQuestion"
import { useAppContext } from "@/context"
import { clearCanvasWithHistory } from "@/logics/canvas"

export const QuestionView = () => {
  const { index, setMode, setIndex, questions } = useAppContext()
  const returnTitle = () => setMode("title")

  const goToNext = () => {
    clearCanvasWithHistory()
    const nextIndex = index + 1
    if (nextIndex >= questions.length) {
      returnTitle()
    } else {
      setIndex(nextIndex)
    }
  }
  const goToPrev = () => {
    clearCanvasWithHistory()
    const nextIndex = index - 1
    if (nextIndex < 0) {
      returnTitle()
    } else {
      setIndex(nextIndex)
    }
  }

  return (
    <KanjiQuestion
      data={questions[index]}
      onPrev={goToPrev}
      onNext={goToNext}
      onReturnTitle={returnTitle}
    />
  )
}
