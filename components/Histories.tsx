import dayjs from "dayjs"
import { useMemo } from "react"
import { getHistory } from "@/logics/history"
import { Kanji } from "@/data/kanji"

type Props = {
  kanji: Kanji
}
export const Histories = ({ kanji }: Props) => {
  const history = useMemo(() => getHistory(kanji).sort((a, b) => b.datetime - a.datetime), [kanji])

  return (
    <table className="text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            履歴
          </th>
          <th scope="col" className="px-6 py-3">
            ◎✖
          </th>
        </tr>
      </thead>
      <tbody>
        {history.map((h) => {
          return (
            <tr
              key={h.datetime}
              className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {dayjs(h.datetime).format("YYYY/MM/DD(ddd)")}
              </th>
              <td className="px-6 py-4">{h.isCorrect ? "◎" : "✖"}</td>
            </tr>
          )
        })}
        <tr>
          <th
            scope="row"
            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            合計
          </th>
          <td className="px-6 py-4">
            ◎：{history.filter((h) => h.isCorrect).length}, ✖：
            {history.filter((h) => !h.isCorrect).length}
          </td>
        </tr>
      </tbody>
    </table>
  )
}
