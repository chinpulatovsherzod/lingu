import type { Locale } from "@/lib/i18n/types";
import {
  combinedMentorContext,
  isVagueMentorMessage,
  type MentorHistoryItem,
} from "./context";

type LocalEntry = {
  patterns: RegExp[];
  replies: Record<Locale, string>;
};

const ENTRIES: LocalEntry[] = [
  {
    patterns: [
      /few.+a\s*few|a\s*few.+few/i,
      /['"]few['"].*['"]a few['"]|['"]a few['"].*['"]few['"]/i,
      /разница.*few|difference.*few/i,
    ],
    replies: {
      ru: `**few** и **a few** — оба означают «немного», но смысл разный.

**few** (без a) = мало, недостаточно — **негативный** оттенок.
- I have **few** friends here. (друзей мало, почти нет)
- **Few** people understood the lecture.

**a few** = несколько, достаточно — **нейтральный/позитивный** оттенок.
- I have **a few** friends here. (есть несколько друзей)
- **A few** students passed the test.

**Правило:** a = «есть хоть что-то», без a = «почти ничего».

**Аналогично:** little (мало) vs a little (немного).`,
      en: `**few** vs **a few** — both mean a small number, but the tone differs.

**few** (no article) = not many, almost none — **negative**.
- I have **few** friends here.
- **Few** people understood the lecture.

**a few** = some, a small but enough number — **neutral/positive**.
- I have **a few** friends here.
- **A few** students passed the test.

**Rule:** "a" suggests "there is some"; without "a" suggests "almost none".

**Similarly:** little vs a little.`,
      uz: `**few** va **a few** — ikkalasi ham «oz», lekin ma'no farq qiladi.

**few** = juda kam, deyarli yo'q (salbiy).
- I have **few** friends here.

**a few** = bir nechta, yetarli darajada (neytral/ijobiy).
- I have **a few** friends here.

**Qoida:** "a" bor bo'lsa — «bir oz bor», "a" yo'q bo'lsa — «deyarli yo'q».`,
    },
  },
  {
    patterns: [
      /present\s*simple|настоящее\s*простое|простое\s*настоящее|hozirgi\s*oddiy/i,
      /объясни.*present\s*simple|explain.*present\s*simple/i,
    ],
    replies: {
      ru: `**Present Simple** — настоящее простое время. Для привычек, фактов и расписаний.

**Формула:**
- Утверждение: I/You/We/They + V1 | He/She/It + V1**+s/es**
- Отрицание: do/does + not + V1
- Вопрос: Do/Does + подлежащее + V1?

**Когда использовать:**
1. Регулярные действия: I **work** every day.
2. Факты: Water **boils** at 100°C.
3. Расписание: The train **leaves** at 8.

**Маркеры:** always, usually, often, sometimes, never, every day

**Примеры:**
- She **speaks** English. / She **doesn't speak** French.
- **Do** you **live** here? — Yes, I **do**.`,
      en: `**Present Simple** — habits, facts, and schedules.

**Formula:**
- Affirmative: I/You/We/They + V1 | He/She/It + V1**+s/es**
- Negative: do/does + not + V1
- Question: Do/Does + subject + V1?

**Uses:**
1. Habits: I **work** every day.
2. Facts: Water **boils** at 100°C.
3. Timetables: The train **leaves** at 8.

**Markers:** always, usually, often, sometimes, never

**Examples:**
- She **speaks** English. / She **doesn't speak** French.
- **Do** you **live** here?`,
      uz: `**Present Simple** — odatlar, faktlar va jadval uchun.

**Formula:**
- I/You/We/They + V1 | He/She/It + V1+s/es
- Inkor: do/does not + V1
- Savol: Do/Does + egа + V1?

**Misollar:**
- She **speaks** English.
- Water **boils** at 100°C.
- **Do** you **live** here?`,
    },
  },
  {
    patterns: [/present\s*perfect|настоящее\s*совершенн|have\s*\/\s*has\s*\+/i],
    replies: {
      ru: `**Present Perfect** — действие в прошлом связано с настоящим.

**Формула:** have/has + V3 (past participle)

**Когда:**
1. Результат сейчас: I **have lost** my keys. (сейчас нет ключей)
2. Опыт: **Have** you ever **been** to London?
3. Длительность до сих пор: She **has worked** here **for** 5 years.

**Маркеры:** already, yet, just, ever, never, for, since

**Примеры:**
- I **have finished** the report.
- He **hasn't called** yet.`,
      en: `**Present Perfect** links a past action to the present.

**Formula:** have/has + past participle

**Uses:**
1. Present result: I **have lost** my keys.
2. Life experience: **Have** you ever **been** to London?
3. Duration until now: She **has worked** here **for** 5 years.

**Markers:** already, yet, just, ever, never, for, since`,
      uz: `**Present Perfect** — o'tgan zamon hozirgi zamon bilan bog'liq.

**Formula:** have/has + V3

**Misollar:**
- I **have finished** the report.
- **Have** you ever **been** to London?`,
    },
  },
  {
    patterns: [
      /past\s*simple.+present\s*perfect|present\s*perfect.+past\s*simple/i,
      /past\s*simple\s+instead|вместо\s+past\s*simple|разница.*past/i,
      /когда\s+использовать\s+present\s*perfect/i,
    ],
    replies: {
      ru: `**Past Simple vs Present Perfect** — главное различие:

**Past Simple** — законченное действие в **конкретном прошлом** (когда известно когда).
- I **visited** Paris **last year**.
- She **left** at 5 pm **yesterday**.

**Present Perfect** — связь с **настоящим** (когда неважно или не указано когда).
- I **have visited** Paris. (опыт — когда — не важно)
- She **has left**. (её сейчас нет)

**Подсказка:** yesterday, last week, in 2010 → Past Simple. already, yet, just, ever → Present Perfect.`,
      en: `**Past Simple vs Present Perfect:**

**Past Simple** — finished action at a **specific past time**.
- I **visited** Paris **last year**.

**Present Perfect** — connection to **now** (time unspecified).
- I **have visited** Paris. (experience)

**Tip:** yesterday, last week → Past Simple. already, yet, just → Present Perfect.`,
      uz: `**Past Simple** — aniq o'tmish vaqt.
**Present Perfect** — hozirgi zamon bilan bog'liq o'tmish.

yesterday, last week → Past Simple
already, yet, just → Present Perfect`,
    },
  },
  {
    patterns: [
      /past\s*perfect|прошедшее\s*совершенн|плюсквамперфект|past\s*perfect\s*simple/i,
      /объясни.*past\s*perfect|explain.*past\s*perfect/i,
    ],
    replies: {
      ru: `**Past Perfect** (Past Perfect Simple) — действие завершилось **до другого момента в прошлом**.

**Формула:** had + V3 (past participle)

**Когда:**
1. Действие было **раньше** другого прошлого действия:
   - When I arrived, the film **had already started**.
   (Сначала начался фильм → потом я пришёл)
2. К моменту в прошлом что-то уже было сделано:
   - She **had finished** her homework before dinner.

**Схема:** had + V3 — «было уже сделано к тому времени»

**Маркеры:** before, after, by, by the time, already, just, never, yet (в отрицаниях)

**Примеры:**
- I **had finished** the report before the meeting started.
- She **hadn't cleared** the database before the server crashed.
- **Had** you **sent** the email before they called you?

**Фокус:** результат — что было сделано к моменту X.

**Не путать с Present Perfect:** had + V3 = всё в прошлом; have/has + V3 = связь с настоящим.`,
      en: `**Past Perfect** — an action completed **before another past event**.

**Formula:** had + past participle (V3)

**Examples:**
- When I arrived, the film **had already started**.
- She **had finished** before dinner.
- **Had** you **met** him before yesterday?

**Markers:** before, after, by the time, already, just`,
      uz: `**Past Perfect** — o'tmishdagi bir voqeadan **oldin** tugagan harakat.

**Formula:** had + V3

**Misol:** When I arrived, the film **had already started**.`,
    },
  },
  {
    patterns: [
      /past\s*perfect\s*continuous|прошедшее\s*совершенн.*длительн|had\s*been\s*\+?\s*v-?ing/i,
      /объясни.*past\s*perfect\s*continuous|explain.*past\s*perfect\s*continuous/i,
    ],
    replies: {
      ru: `**Past Perfect Continuous** — действие **длилось** в прошлом до другого момента. Важен **процесс** и его продолжительность.

**Формула:** had been + V-ing

**Когда:**
1. Действие тянулось до события в прошлом:
   - We **had been testing** the API for three hours before we found the bug.
2. Объясняет причину в прошлом:
   - He was tired because he **had been working** all night.

**Маркеры:** for, since, all day, all night

**Simple vs Continuous:**
- **Simple** (had + V3) — результат: By 6 PM, I **had integrated** three modules.
- **Continuous** (had been + V-ing) — длительность: By 6 PM, I **had been integrating** for five hours.

**State verbs** (know, love, believe) — только Simple: I **had known** him for years (не had been knowing).`,
      en: `**Past Perfect Continuous** — an action that **continued** in the past up to another point. Focus on **duration**.

**Formula:** had been + V-ing

**Examples:**
- We **had been testing** the API for three hours before we found the bug.
- He was tired because he **had been working** all night.

**Markers:** for, since, all day, all night`,
      uz: `**Past Perfect Continuous** — o'tmishdagi boshqa paytgacha davom etgan jarayon.

**Formula:** had been + V-ing

**Misol:** We **had been testing** the API for three hours.`,
    },
  },
  {
    patterns: [/past\s*simple|прошедшее\s*простое(?!е\s*совершенн)/i],
    replies: {
      ru: `**Past Simple** — завершённое действие в прошлом.

**Формула:** V2 (или did + V1 для вопросов/отрицаний)

**Примеры:**
- I **worked** yesterday.
- She **didn't go** to school.
- **Did** you **see** him? — Yes, I **did**.

**Маркеры:** yesterday, last week, ago, in 2019, when`,
      en: `**Past Simple** — completed actions in the past.

**Formula:** V2 (or did + V1 for questions/negatives)

**Examples:**
- I **worked** yesterday.
- **Did** you **see** him?`,
      uz: `**Past Simple** — o'tmishdagi tugallangan harakat.

**Formula:** V2 / did + V1

**Misol:** I **worked** yesterday.`,
    },
  },
  {
    patterns: [/ielts.*writing.*task\s*2|writing\s*task\s*2|вступление|introduction.*ielts|как\s+написать.*вступление/i],
    replies: {
      ru: `**Вступление для IELTS Writing Task 2** (4–5 предложений):

**Структура:**
1. **Перефразируйте** тему своими словами (не копируйте!).
2. **Общий контекст** — почему тема важна.
3. **Ваш тезис** — чёткая позиция (your opinion / both views).

**Пример** (тема: technology makes life worse):
> It is often argued that modern technology has a negative impact on people's lives. While technology undoubtedly brings challenges, I believe its benefits outweigh the drawbacks when used responsibly.

**Не делайте:** «In this essay I will discuss...» — это снижает балл.

**Цель:** 40–60 слов, без личных примеров во вступлении.`,
      en: `**IELTS Writing Task 2 Introduction** (4–5 sentences):

1. **Paraphrase** the topic in your own words.
2. **Brief context** — why the issue matters.
3. **Thesis** — your clear position.

**Avoid:** "In this essay I will discuss..." — lowers your score.

**Target:** 40–60 words.`,
      uz: `**IELTS Writing Task 2 kirishi:**

1. Mavzuni o'z so'zlaringiz bilan qayta yozing.
2. Qisqa kontekst.
3. Aniq fikr (thesis).

40–60 so'z, "In this essay..." dan qoching.`,
    },
  },
  {
    patterns: [/запоминать\s+слов|remember.*word|lug'at|vocabulary.*remember|новые\s+слова/i],
    replies: {
      ru: `**Как запоминать слова эффективно:**

1. **Контекст** — учите слово в предложении, не изолированно.
2. **Повторение с интервалом** — сегодня, завтра, через 3 дня (используйте карточки в разделе «Словарь»).
3. **Активное использование** — составьте 3 своих предложения.
4. **Связи** — синонимы, антонимы, word families (happy → happiness).
5. **Группировка по темам** — travel, work, IELTS Academic.

**Пример:** instead of just "reluctant" → "She was **reluctant** to speak in public."`,
      en: `**Effective vocabulary learning:**

1. Learn words **in context**, not in isolation.
2. **Spaced repetition** — review today, tomorrow, in 3 days.
3. **Active use** — write 3 own sentences.
4. **Word families** — happy → happiness.
5. **Topic groups** — travel, work, IELTS.

**Example:** "She was **reluctant** to speak in public."`,
      uz: `**So'zlarni eslab qolish:**

1. Kontekstda o'rganing.
2. Oraliq takrorlash (flashcards).
3. 3 ta o'z jumla yozing.
4. Mavzu bo'yicha guruhlang.`,
    },
  },
  {
    patterns: [/little.+a little|a little.+little/i],
    replies: {
      ru: `**little** vs **a little** — как few vs a few, но для **неисчисляемых** существительных.

**little** = мало, недостаточно (негативно)
- There is **little** water left.

**a little** = немного, достаточно (нейтрально)
- There is **a little** water left.

**few/a few** — для исчисляемых (friends, books).`,
      en: `**little** vs **a little** — for **uncountable** nouns.

**little** = not enough (negative)
**a little** = some, enough (neutral)

Use **few/a few** for countable nouns.`,
      uz: `**little** — juda kam (sanalmaydigan).
**a little** — biroz (sanalmaydigan).
**few/a few** — sanaladigan otlar uchun.`,
    },
  },
];

const FEW_MEANING: Record<Locale, string> = {
  ru: `**Смысл разницы простыми словами:**

**few** = «почти нет» → негативный оттенок. I have **few** friends = друзей мало, мне одиноко.

**a few** = «есть несколько» → нейтрально или позитивно. I have **a few** friends = у меня есть друзья, не ноль.

**Перевод на ощущение:**
- few friends → «мало друзей» (жалоба)
- a few friends → «несколько друзей» (нормально)

**Тот же принцип:** little money (денег мало) vs a little money (есть немного денег).`,
  en: `**The meaning in simple terms:**

**few** = almost none (negative). I have **few** friends.

**a few** = some, enough (neutral/positive). I have **a few** friends.

**little** vs **a little** works the same way for uncountable nouns.`,
  uz: `**Oddiy ma'no:**

**few** = deyarli yo'q (salbiy).
**a few** = bir nechta bor (neytral/ijobiy).

**little** / **a little** — sanalmaydigan otlar uchun xuddi shunday.`,
};

const FALLBACK: Record<Locale, string> = {
  ru: "Напишите вопрос конкретнее — укажите время, слово или тему IELTS.",
  en: "Please be more specific — name a tense, word, or IELTS topic.",
  uz: "Aniqroq yozing — zamon, so'z yoki IELTS mavzusi.",
};

export function getLocalMentorReply(
  message: string,
  locale: Locale,
  history?: MentorHistoryItem[]
): string {
  const text = message.trim();
  if (!text) return FALLBACK[locale];

  const searchText = history?.length ? combinedMentorContext(text, history) : text;

  for (const entry of ENTRIES) {
    if (entry.patterns.some((p) => p.test(searchText))) {
      return entry.replies[locale] ?? entry.replies.ru;
    }
  }

  const lastAssistant = history?.length
    ? [...history].reverse().find((m) => m.role === "assistant")
    : undefined;

  if (lastAssistant && isVagueMentorMessage(text)) {
    const ctx = lastAssistant.content.toLowerCase();
    if (ctx.includes("few") && ctx.includes("a few")) {
      return FEW_MEANING[locale];
    }
    if (ctx.includes("past perfect")) {
      const entry = ENTRIES.find((e) =>
        e.patterns.some((p) => /past\s*perfect/i.test(p.source))
      );
      if (entry) return entry.replies[locale] ?? entry.replies.ru;
    }
    if (ctx.includes("present simple")) {
      const entry = ENTRIES.find((e) =>
        e.patterns.some((p) => /present\s*simple/i.test(p.source))
      );
      if (entry) return entry.replies[locale] ?? entry.replies.ru;
    }
    if (ctx.includes("present perfect")) {
      const entry = ENTRIES.find((e) =>
        e.patterns.some((p) => /present\s*perfect/i.test(p.source))
      );
      if (entry) return entry.replies[locale] ?? entry.replies.ru;
    }
  }

  return FALLBACK[locale];
}
