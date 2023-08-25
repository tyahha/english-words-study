import { Question } from "@/components/Question"
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
    <Question
      data={questions[index]}
      onPrev={goToPrev}
      onNext={goToNext}
      onReturnTitle={returnTitle}
    />
  )
}
