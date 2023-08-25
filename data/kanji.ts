import { KanjiData1, KanjiData1Category } from "@/data/kanji001"
import { KanjiData2, KanjiData2Category } from "@/data/kanji002"
import { KanjiData3, KanjiData3Category } from "@/data/kanji003"
import { KanjiData4, KanjiData4Category } from "@/data/kanji004"
import { KanjiDataB1_2, KanjiDataB1_2Category } from "@/data/kanjiB001-2"
import { KanjiDataB1_1, KanjiDataB1_1Category } from "@/data/kanjiB001-1"
import { KanjiData5, KanjiData5Category } from "@/data/kanji005"
import { KanjiData6, KanjiData6Category } from "@/data/kanji006"
import { KanjiData7, KanjiData7Category } from "@/data/kanji007"
import { KanjiData8, KanjiData8Category } from "@/data/kanji008"
import { KanjiDataB2_1, KanjiDataB2_1Category } from "@/data/kanjiB002-1"
import { KanjiDataB2_2, KanjiDataB2_2Category } from "@/data/kanjiB002-2"
import { KanjiData9, KanjiData9Category } from "@/data/kanji009"
import { KanjiData10, KanjiData10Category } from "@/data/kanji010"
import { KanjiData11, KanjiData11Category } from "@/data/kanji011"
import { KanjiData12, KanjiData12Category } from "@/data/kanji012"
import { KanjiDataB3_1, KanjiDataB3_1Category } from "@/data/kanjiB003_1"
import { KanjiDataB3_2, KanjiDataB3_2Category } from "@/data/kanjiB003_2"

type QuestionType = "read" | "write"

export type Kanji = {
  id: string
  sentence: string
  kanji: string
  kana: string
  questionType: QuestionType
}

export const KanjiDataCategories = [
  KanjiData1Category,
  KanjiData2Category,
  KanjiData3Category,
  KanjiData4Category,
  KanjiDataB1_1Category,
  KanjiDataB1_2Category,
  KanjiData5Category,
  KanjiData6Category,
  KanjiData7Category,
  KanjiData8Category,
  KanjiDataB2_1Category,
  KanjiDataB2_2Category,
  KanjiData9Category,
  KanjiData10Category,
  KanjiData11Category,
  KanjiData12Category,
  KanjiDataB3_1Category,
  KanjiDataB3_2Category,
]

export const KanjiData: Kanji[] = [
  ...KanjiData1,
  ...KanjiData2,
  ...KanjiData3,
  ...KanjiData4,
  ...KanjiDataB1_1,
  ...KanjiDataB1_2,
  ...KanjiData5,
  ...KanjiData6,
  ...KanjiData7,
  ...KanjiData8,
  ...KanjiDataB2_1,
  ...KanjiDataB2_2,
  ...KanjiData9,
  ...KanjiData10,
  ...KanjiData11,
  ...KanjiData12,
  ...KanjiDataB3_1,
  ...KanjiDataB3_2,
]
