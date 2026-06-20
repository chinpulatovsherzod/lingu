export type ExampleSentence = { en: string; ru: string };

export type FormulaExamples = {
  affirmative: ExampleSentence[];
  negative: ExampleSentence[];
  question: ExampleSentence[];
};

export type TenseFormula = {
  affirmative: string;
  negative: string;
  question: string;
  note?: string;
  examples: FormulaExamples;
};

export type RuleItem = {
  rule: string;
  examples: ExampleSentence[];
};

export type TenseTopic = {
  slug: string;
  title: string;
  titleRu: string;
  group: "Present" | "Past" | "Future" | "Grammar";
  groupRu: string;
  level: string;
  icon: "book" | "clock" | "layers";
  purpose: string;
  example: ExampleSentence;
  formulas?: TenseFormula;
  formulaLabels?: { affirmative?: string; negative?: string; question?: string };
  rules: RuleItem[];
  extra?: { title: string; content: string }[];
};

export const TENSE_GROUPS = [
  { id: "Present", label: "Настоящие времена (Present Tenses)" },
  { id: "Past", label: "Прошедшие времена (Past Tenses)" },
  { id: "Future", label: "Будущие времена (Future Tenses)" },
  { id: "Grammar", label: "Грамматика и конструкции" },
] as const;

export const TENSE_TOPICS: TenseTopic[] = [
  {
    slug: "present-simple",
    title: "Present Simple",
    titleRu: "Настоящее простое",
    group: "Present",
    groupRu: "Настоящие времена",
    level: "A1",
    icon: "book",
    purpose: "Регулярные действия, привычки, общеизвестные факты.",
    example: { en: "I work every day.", ru: "Я работаю каждый день." },
    formulas: {
      affirmative: "S + V / V-s  (he, she, it → V-s)",
      negative: "S + do/does + not + V",
      question: "Do/Does + S + V?",
      note: "Для he, she, it вспомогательный глагол — does, а смысловой глагол без -s.",
      examples: {
        affirmative: [
          { en: "I work every day.", ru: "Я работаю каждый день." },
          { en: "She works at a hospital.", ru: "Она работает в больнице." },
          { en: "We play football on Sundays.", ru: "Мы играем в футбол по воскресеньям." },
        ],
        negative: [
          { en: "I do not work on Sundays.", ru: "Я не работаю по воскресеньям." },
          { en: "She does not like coffee.", ru: "Она не любит кофе." },
          { en: "They don't speak French.", ru: "Они не говорят по-французски." },
        ],
        question: [
          { en: "Do you work here?", ru: "Ты здесь работаешь?" },
          { en: "Does she speak English?", ru: "Она говорит по-английски?" },
          { en: "Do they live in Moscow?", ru: "Они живут в Москве?" },
        ],
      },
    },
    rules: [
      {
        rule: "Наречия частотности (always, usually, often, sometimes, rarely, never) ставятся перед смысловым глаголом.",
        examples: [
          { en: "She always drinks tea in the morning.", ru: "Она всегда пьёт чай по утрам." },
          { en: "He usually goes to bed at 10 PM.", ru: "Он обычно ложится спать в 10 вечера." },
          { en: "I often read books before sleep.", ru: "Я часто читаю книги перед сном." },
        ],
      },
      {
        rule: "В третьем лице единственного числа (he, she, it) к глаголу добавляется окончание -s или -es.",
        examples: [
          { en: "He works in an office.", ru: "Он работает в офисе." },
          { en: "She watches TV every evening.", ru: "Она смотрит телевизор каждый вечер." },
          { en: "It rains a lot in autumn.", ru: "Осенью часто идёт дождь." },
        ],
      },
      {
        rule: "Используется с расписаниями, фактами и привычками.",
        examples: [
          { en: "The train leaves at 8 AM.", ru: "Поезд отправляется в 8 утра. (расписание)" },
          { en: "Water boils at 100°C.", ru: "Вода кипит при 100°C. (факт)" },
          { en: "I brush my teeth twice a day.", ru: "Я чищу зубы два раза в день. (привычка)" },
        ],
      },
    ],
  },
  {
    slug: "present-continuous",
    title: "Present Continuous",
    titleRu: "Настоящее длительное",
    group: "Present",
    groupRu: "Настоящие времена",
    level: "A1",
    icon: "clock",
    purpose: "Действие происходит прямо сейчас, в момент речи.",
    example: { en: "I am working right now.", ru: "Я работаю прямо сейчас." },
    formulas: {
      affirmative: "S + am/is/are + V-ing",
      negative: "S + am/is/are + not + V-ing",
      question: "Am/Is/Are + S + V-ing?",
      examples: {
        affirmative: [
          { en: "I am working right now.", ru: "Я работаю прямо сейчас." },
          { en: "She is reading a book.", ru: "Она читает книгу." },
          { en: "They are playing in the park.", ru: "Они играют в парке." },
        ],
        negative: [
          { en: "I am not sleeping.", ru: "Я не сплю." },
          { en: "He is not watching TV.", ru: "Он не смотрит телевизор." },
          { en: "We aren't listening to music.", ru: "Мы не слушаем музыку." },
        ],
        question: [
          { en: "Are you working now?", ru: "Ты сейчас работаешь?" },
          { en: "Is she cooking dinner?", ru: "Она готовит ужин?" },
          { en: "What are they doing?", ru: "Что они делают?" },
        ],
      },
    },
    rules: [
      {
        rule: "Маркеры времени: now, right now, at the moment, currently, today (в значении «сегодня, прямо сейчас»).",
        examples: [
          { en: "I am studying at the moment.", ru: "Я сейчас учусь." },
          { en: "She is talking on the phone right now.", ru: "Она прямо сейчас разговаривает по телефону." },
          { en: "They are travelling this week.", ru: "На этой неделе они путешествуют." },
        ],
      },
      {
        rule: "Некоторые глаголы состояния (know, like, believe, want, need) обычно не используются в Continuous.",
        examples: [
          { en: "I know the answer. (не I am knowing)", ru: "Я знаю ответ." },
          { en: "She likes chocolate. (не She is liking)", ru: "Она любит шоколад." },
          { en: "I want some water. (не I am wanting)", ru: "Я хочу воды." },
        ],
      },
    ],
  },
  {
    slug: "present-perfect",
    title: "Present Perfect",
    titleRu: "Настоящее совершенное",
    group: "Present",
    groupRu: "Настоящие времена",
    level: "A2",
    icon: "layers",
    purpose: "Действие завершилось к текущему моменту; важен результат сейчас.",
    example: { en: "I have already worked today.", ru: "Я уже поработал сегодня." },
    formulas: {
      affirmative: "S + have/has + V3 (has — для he, she, it)",
      negative: "S + have/has + not + V3",
      question: "Have/Has + S + V3?",
      examples: {
        affirmative: [
          { en: "I have already worked today.", ru: "Я уже поработал сегодня." },
          { en: "She has visited Paris three times.", ru: "Она три раза была в Париже." },
          { en: "They have finished their homework.", ru: "Они сделали домашнее задание." },
        ],
        negative: [
          { en: "I have not seen this film.", ru: "Я не видел этот фильм." },
          { en: "He hasn't eaten breakfast yet.", ru: "Он ещё не позавтракал." },
          { en: "We haven't met before.", ru: "Мы раньше не встречались." },
        ],
        question: [
          { en: "Have you ever been to London?", ru: "Ты когда-нибудь был в Лондоне?" },
          { en: "Has she called you?", ru: "Она тебе звонила?" },
          { en: "Have they arrived yet?", ru: "Они уже приехали?" },
        ],
      },
    },
    rules: [
      {
        rule: "Маркеры: already, yet, just, ever, never, since, for.",
        examples: [
          { en: "I have just finished my lunch.", ru: "Я только что пообедал." },
          { en: "She has lived here since 2020.", ru: "Она живёт здесь с 2020 года." },
          { en: "We have known each other for ten years.", ru: "Мы знаем друг друга десять лет." },
        ],
      },
      {
        rule: "Связывает прошлое действие с настоящим результатом — важно не когда, а что уже сделано.",
        examples: [
          { en: "I have lost my keys. (и сейчас их нет)", ru: "Я потерял ключи." },
          { en: "She has broken her phone. (телефон сломан сейчас)", ru: "Она сломала телефон." },
          { en: "They have bought a new car. (машина у них есть)", ru: "Они купили новую машину." },
        ],
      },
    ],
  },
  {
    slug: "present-perfect-continuous",
    title: "Present Perfect Continuous",
    titleRu: "Настоящее совершенное длительное",
    group: "Present",
    groupRu: "Настоящие времена",
    level: "B1",
    icon: "clock",
    purpose: "Действие началось в прошлом, длилось и продолжается или только что закончилось.",
    example: { en: "I have been working for three hours.", ru: "Я работаю уже три часа." },
    formulas: {
      affirmative: "S + have/has + been + V-ing",
      negative: "S + have/has + not + been + V-ing",
      question: "Have/Has + S + been + V-ing?",
      examples: {
        affirmative: [
          { en: "I have been working for three hours.", ru: "Я работаю уже три часа." },
          { en: "She has been studying English since January.", ru: "Она изучает английский с января." },
          { en: "They have been waiting for an hour.", ru: "Они ждут уже час." },
        ],
        negative: [
          { en: "I haven't been sleeping well lately.", ru: "В последнее время я плохо сплю." },
          { en: "He hasn't been exercising much.", ru: "Он мало занимается спортом." },
          { en: "We haven't been watching TV today.", ru: "Сегодня мы не смотрели телевизор." },
        ],
        question: [
          { en: "How long have you been learning English?", ru: "Как долго ты учишь английский?" },
          { en: "Has she been crying?", ru: "Она плакала? (и видно по глазам)" },
          { en: "What have they been doing all day?", ru: "Что они делали весь день?" },
        ],
      },
    },
    rules: [
      {
        rule: "Акцент на длительности процесса — часто с for (сколько времени) и since (с какого момента).",
        examples: [
          { en: "I have been reading for two hours.", ru: "Я читаю уже два часа." },
          { en: "She has been working here since 2019.", ru: "Она работает здесь с 2019 года." },
          { en: "It has been raining all morning.", ru: "Дождь идёт всё утро." },
        ],
      },
      {
        rule: "Подчёркивает, что действие только что закончилось и виден результат.",
        examples: [
          { en: "You have been running — you look tired!", ru: "Ты бегал — выглядишь уставшим!" },
          { en: "She has been cooking — the kitchen smells great.", ru: "Она готовила — на кухне отлично пахнет." },
          { en: "They have been painting the room.", ru: "Они красили комнату. (видны следы краски)" },
        ],
      },
    ],
  },
  {
    slug: "past-simple",
    title: "Past Simple",
    titleRu: "Прошедшее простое",
    group: "Past",
    groupRu: "Прошедшие времена",
    level: "A1",
    icon: "book",
    purpose: "Факт или завершённое действие в конкретный момент в прошлом.",
    example: { en: "I worked yesterday.", ru: "Я работал вчера." },
    formulas: {
      affirmative: "S + V2 / V-ed",
      negative: "S + did + not + V  (глагол в начальной форме!)",
      question: "Did + S + V?",
      examples: {
        affirmative: [
          { en: "I worked yesterday.", ru: "Я работал вчера." },
          { en: "She went to school this morning.", ru: "Она ходила в школу сегодня утром." },
          { en: "They played football last Sunday.", ru: "В прошлое воскресенье они играли в футбол." },
        ],
        negative: [
          { en: "I did not work yesterday.", ru: "Я не работал вчера." },
          { en: "She didn't go to the party.", ru: "Она не пошла на вечеринку." },
          { en: "We didn't see him.", ru: "Мы его не видели." },
        ],
        question: [
          { en: "Did you work yesterday?", ru: "Ты работал вчера?" },
          { en: "Did she call you?", ru: "Она тебе звонила?" },
          { en: "Where did they go?", ru: "Куда они пошли?" },
        ],
      },
    },
    rules: [
      {
        rule: "Маркеры: yesterday, last week/month/year, ago, in 2020, when I was young.",
        examples: [
          { en: "I met him two years ago.", ru: "Я познакомился с ним два года назад." },
          { en: "She visited London last summer.", ru: "Прошлым летом она ездила в Лондон." },
          { en: "We lived in Berlin in 2018.", ru: "В 2018 году мы жили в Берлине." },
        ],
      },
      {
        rule: "После did глагол всегда возвращается в начальную форму (не V2!).",
        examples: [
          { en: "Did she go home? (не Did she went)", ru: "Она пошла домой?" },
          { en: "I didn't buy it. (не didn't bought)", ru: "Я это не купил." },
          { en: "Did they eat pizza? (не Did they ate)", ru: "Они ели пиццу?" },
        ],
      },
    ],
  },
  {
    slug: "past-continuous",
    title: "Past Continuous",
    titleRu: "Прошедшее длительное",
    group: "Past",
    groupRu: "Прошедшие времена",
    level: "A2",
    icon: "clock",
    purpose: "Действие длилось в определённый момент или период в прошлом.",
    example: { en: "I was working at 5 PM yesterday.", ru: "Вчера в 5 вечера я работал." },
    formulas: {
      affirmative: "S + was/were + V-ing  (was — I/he/she/it; were — you/we/they)",
      negative: "S + was/were + not + V-ing",
      question: "Was/Were + S + V-ing?",
      examples: {
        affirmative: [
          { en: "I was working at 5 PM yesterday.", ru: "Вчера в 5 вечера я работал." },
          { en: "She was sleeping when I called.", ru: "Она спала, когда я позвонил." },
          { en: "They were playing football all afternoon.", ru: "Весь день они играли в футбол." },
        ],
        negative: [
          { en: "I wasn't sleeping at midnight.", ru: "В полночь я не спал." },
          { en: "He wasn't listening to the teacher.", ru: "Он не слушал учителя." },
          { en: "We weren't watching TV.", ru: "Мы не смотрели телевизор." },
        ],
        question: [
          { en: "Were you working at 8 AM?", ru: "Ты работал в 8 утра?" },
          { en: "Was she cooking dinner?", ru: "Она готовила ужин?" },
          { en: "What were they doing?", ru: "Что они делали?" },
        ],
      },
    },
    rules: [
      {
        rule: "Описывает процесс в конкретный момент в прошлом: at 5 PM, while, all day.",
        examples: [
          { en: "At 7 PM I was having dinner.", ru: "В 7 вечера я ужинал." },
          { en: "She was reading while I was cooking.", ru: "Она читала, пока я готовил." },
          { en: "It was raining all night.", ru: "Всю ночь шёл дождь." },
        ],
      },
      {
        rule: "Часто сочетается с Past Simple: длительное действие прерывается коротким.",
        examples: [
          { en: "I was working when he called.", ru: "Я работал, когда он позвонил." },
          { en: "She was cooking when the doorbell rang.", ru: "Она готовила, когда зазвонил звонок." },
          { en: "They were playing when it started to rain.", ru: "Они играли, когда начался дождь." },
        ],
      },
    ],
  },
  {
    slug: "past-perfect",
    title: "Past Perfect Simple",
    titleRu: "Прошедшее совершенное (Past Perfect Simple)",
    group: "Past",
    groupRu: "Прошедшие времена",
    level: "B1",
    icon: "layers",
    purpose:
      "Действие завершилось до определённого момента или другого действия в прошлом. Это «предпрошедшее» время — первое из двух событий в цепочке.",
    example: {
      en: "I had finished the report before the meeting started.",
      ru: "Я закончил отчёт до того, как началось собрание.",
    },
    formulas: {
      affirmative: "S + had + V3 (-ed)",
      negative: "S + had not (hadn't) + V3 (-ed)",
      question: "Had + S + V3 (-ed)?",
      note: "Had — для всех лиц (I/you/he/she/it/we/they). V3 — третья форма глагола (gone, written) или правильный глагол с -ed.",
      examples: {
        affirmative: [
          {
            en: "I had finished the report before the meeting started.",
            ru: "Я закончил отчёт до того, как началось собрание.",
          },
          {
            en: "She had left when I arrived.",
            ru: "Она уже ушла, когда я приехал.",
          },
          {
            en: "They had eaten before the film started.",
            ru: "Они поели до начала фильма.",
          },
        ],
        negative: [
          {
            en: "She hadn't cleared the database before the server crashed.",
            ru: "Она не очистила базу данных до того, как упал сервер.",
          },
          {
            en: "I hadn't finished my work by 5 PM.",
            ru: "Я не закончил работу к 5 вечера.",
          },
          {
            en: "We hadn't met until that day.",
            ru: "Мы не встречались до того дня.",
          },
        ],
        question: [
          {
            en: "Had you sent the email before they called you?",
            ru: "Ты отправил письмо до того, как они тебе позвонили?",
          },
          {
            en: "Had she already left?",
            ru: "Она уже ушла?",
          },
          {
            en: "Had they finished the project by Friday?",
            ru: "Они закончили проект к пятнице?",
          },
        ],
      },
    },
    rules: [
      {
        rule: "Действие завершилось до другого момента или действия в прошлом — «предпрошедшее» время.",
        examples: [
          {
            en: "When I got home, she had already cooked dinner.",
            ru: "Когда я пришёл домой, она уже приготовила ужин.",
          },
          {
            en: "He had studied English before he moved to the UK.",
            ru: "Он учил английский до переезда в Великобританию.",
          },
          {
            en: "By the time we arrived, the show had started.",
            ru: "К моменту нашего прихода шоу уже началось.",
          },
        ],
      },
      {
        rule: "Маркеры: by (к какому-то времени), before, after, already, just, never, yet (в отрицаниях).",
        examples: [
          {
            en: "By 5 PM, I had completed all the tasks.",
            ru: "К 5 вечера я выполнил все задачи.",
          },
          {
            en: "She had never tried sushi before last night.",
            ru: "Она никогда раньше не пробовала суши до прошлой ночи.",
          },
          {
            en: "After he had finished, he went home.",
            ru: "После того как он закончил, он пошёл домой.",
          },
        ],
      },
      {
        rule: "Фокус на результате: что было сделано или готово к моменту X.",
        examples: [
          {
            en: "By 6 PM, I had integrated three modules.",
            ru: "К 6 вечера я интегрировал три модуля. (виден результат)",
          },
          {
            en: "She had written five reports by Monday.",
            ru: "К понедельнику она написала пять отчётов.",
          },
          {
            en: "They had sold the house before they bought a new one.",
            ru: "Они продали дом до покупки нового.",
          },
        ],
      },
    ],
    extra: [
      {
        title: "⚠️ State verbs (глаголы состояния)",
        content:
          "Глаголы состояния (know, love, understand, believe, have в значении «обладать», own и др.) нельзя использовать в Continuous — только Simple.\n\n❌ I had been knowing him for years.\n✅ I had known him for years before we started a business.",
      },
      {
        title: "Шпаргалка",
        content:
          "Важно сказать, сколько раз что-то произошло или что именно было готово к моменту X → Past Perfect Simple.\n\nНе путать с Present Perfect: had + V3 — всё в прошлом; have/has + V3 — связь с настоящим.",
      },
    ],
  },
  {
    slug: "past-perfect-continuous",
    title: "Past Perfect Continuous",
    titleRu: "Прошедшее совершенное длительное (Past Perfect Continuous)",
    group: "Past",
    groupRu: "Прошедшие времена",
    level: "B2",
    icon: "clock",
    purpose:
      "Действие началось в прошлом, длилось какое-то время и продолжалось (или только что закончилось) прямо перед другим моментом в прошлом. Важен процесс и его продолжительность.",
    example: {
      en: "We had been testing the API for three hours before we found the bug.",
      ru: "Мы тестировали API три часа, прежде чем нашли баг.",
    },
    formulas: {
      affirmative: "S + had been + V-ing",
      negative: "S + had not (hadn't) been + V-ing",
      question: "Had + S + been + V-ing?",
      examples: {
        affirmative: [
          {
            en: "We had been testing the API for three hours before we found the bug.",
            ru: "Мы тестировали API три часа, прежде чем нашли баг.",
          },
          {
            en: "She had been waiting for an hour before he arrived.",
            ru: "Она ждала час, прежде чем он приехал.",
          },
          {
            en: "They had been living there for five years when they moved.",
            ru: "Они жили там пять лет, когда переехали.",
          },
        ],
        negative: [
          {
            en: "He hadn't been working there long when the project closed.",
            ru: "Он работал там недолго, когда проект закрылся.",
          },
          {
            en: "I hadn't been sleeping well before the exam.",
            ru: "Я плохо спал до экзамена.",
          },
          {
            en: "We hadn't been talking for long.",
            ru: "Мы долго не разговаривали.",
          },
        ],
        question: [
          {
            en: "Had you been waiting for a long time before the manager arrived?",
            ru: "Ты долго ждал до того, как пришёл менеджер?",
          },
          {
            en: "How long had you been studying before the exam?",
            ru: "Как долго ты учился до экзамена?",
          },
          {
            en: "Had they been working on the project?",
            ru: "Они работали над проектом?",
          },
        ],
      },
    },
    rules: [
      {
        rule: "Действие длилось до определённого момента или другого действия в прошлом — акцент на процессе.",
        examples: [
          {
            en: "He was tired because he had been working all night.",
            ru: "Он устал, потому что работал всю ночь.",
          },
          {
            en: "Her eyes were red — she had been crying.",
            ru: "Глаза были красные — она плакала.",
          },
          {
            en: "The ground was wet because it had been raining.",
            ru: "Земля была мокрой, потому что шёл дождь.",
          },
        ],
      },
      {
        rule: "Маркеры: for (в течение), since (с какого-то момента), all day / all night.",
        examples: [
          {
            en: "She had been teaching for ten years before she retired.",
            ru: "Она преподавала десять лет до выхода на пенсию.",
          },
          {
            en: "They had been dating since college.",
            ru: "Они встречались со времён колледжа.",
          },
          {
            en: "I had been trying to call you for an hour.",
            ru: "Я пытался дозвониться до тебя целый час.",
          },
        ],
      },
      {
        rule: "Часто объясняет причину состояния в прошлом (усталость, следы действия).",
        examples: [
          {
            en: "She was out of breath because she had been running.",
            ru: "Она запыхалась, потому что бегала.",
          },
          {
            en: "We had been waiting for an hour when the bus finally came.",
            ru: "Мы ждали целый час, когда наконец пришёл автобус.",
          },
          {
            en: "He had been studying all day, so he was exhausted.",
            ru: "Он учился весь день, поэтому был измотан.",
          },
        ],
      },
    ],
    extra: [
      {
        title: "Simple vs Continuous — в чём разница?",
        content:
          "Past Perfect Simple — фокус на результате (что сделано? сколько сделано?):\n• By 6 PM, I had integrated three modules. (к 6 вечера я интегрировал три модуля)\n\nPast Perfect Continuous — фокус на продолжительности (как долго шло действие?):\n• By 6 PM, I had been integrating the system for five hours. (к 6 вечера я интегрировал систему уже 5 часов)\n\nШпаргалка: важно подчеркнуть, что действие тянулось и занимало время до момента X → Continuous.",
      },
      {
        title: "⚠️ State verbs (глаголы состояния)",
        content:
          "Глаголы состояния (know, love, understand, believe, own и др.) нельзя использовать в Continuous.\n\n❌ I had been knowing him for years.\n✅ I had known him for years before we started a business.",
      },
    ],
  },
  {
    slug: "future-simple",
    title: "Future Simple",
    titleRu: "Будущее простое",
    group: "Future",
    groupRu: "Будущие времена",
    level: "A2",
    icon: "book",
    purpose: "Спонтанные решения, прогнозы, обещания.",
    example: { en: "I will work tomorrow.", ru: "Я буду работать завтра." },
    formulas: {
      affirmative: "S + will + V",
      negative: "S + will not + V  (won't)",
      question: "Will + S + V?",
      examples: {
        affirmative: [
          { en: "I will work tomorrow.", ru: "Я буду работать завтра." },
          { en: "She will call you later.", ru: "Она позвонит тебе позже." },
          { en: "They will arrive at 6 PM.", ru: "Они приедут в 6 вечера." },
        ],
        negative: [
          { en: "I will not be late.", ru: "Я не опоздаю." },
          { en: "She won't forget your birthday.", ru: "Она не забудет твой день рождения." },
          { en: "We won't need a car.", ru: "Нам не понадобится машина." },
        ],
        question: [
          { en: "Will you help me?", ru: "Ты мне поможешь?" },
          { en: "Will she come to the party?", ru: "Она придёт на вечеринку?" },
          { en: "What will they do?", ru: "Что они будут делать?" },
        ],
      },
    },
    rules: [
      {
        rule: "Спонтанное решение, принятое в момент речи.",
        examples: [
          { en: "The phone is ringing. I'll answer it!", ru: "Телефон звонит. Я отвечу!" },
          { en: "I'm hungry. I'll make a sandwich.", ru: "Я голоден. Я сделаю бутерброд." },
          { en: "It's cold. I'll close the window.", ru: "Холодно. Я закрою окно." },
        ],
      },
      {
        rule: "Прогнозы и обещания. Маркеры: tomorrow, next week, soon, in the future.",
        examples: [
          { en: "It will rain tomorrow.", ru: "Завтра будет дождь." },
          { en: "I promise I will call you.", ru: "Обещаю, я тебе позвоню." },
          { en: "She will graduate next year.", ru: "Она закончит учёбу в следующем году." },
        ],
      },
      {
        rule: "Future in the Past: будущее с точки зрения прошлого — would вместо will.",
        examples: [
          { en: "I said I would work on Monday.", ru: "Я сказал, что буду работать в понедельник." },
          { en: "She promised she would help us.", ru: "Она пообещала, что поможет нам." },
          { en: "He knew he would be late.", ru: "Он знал, что опоздает." },
        ],
      },
    ],
  },
  {
    slug: "future-continuous",
    title: "Future Continuous",
    titleRu: "Будущее длительное",
    group: "Future",
    groupRu: "Будущие времена",
    level: "B1",
    icon: "clock",
    purpose: "Действие будет длиться в определённый момент в будущем.",
    example: { en: "I will be working at this time tomorrow.", ru: "Завтра в это время я буду работать." },
    formulas: {
      affirmative: "S + will be + V-ing",
      negative: "S + will not + be + V-ing",
      question: "Will + S + be + V-ing?",
      examples: {
        affirmative: [
          { en: "I will be working at this time tomorrow.", ru: "Завтра в это время я буду работать." },
          { en: "She will be sleeping at midnight.", ru: "В полночь она будет спать." },
          { en: "They will be travelling next week.", ru: "На следующей неделе они будут путешествовать." },
        ],
        negative: [
          { en: "I won't be working on Sunday.", ru: "В воскресенье я не буду работать." },
          { en: "She won't be using the car.", ru: "Она не будет пользоваться машиной." },
          { en: "We won't be waiting long.", ru: "Мы долго ждать не будем." },
        ],
        question: [
          { en: "Will you be working at 9 AM?", ru: "Ты будешь работать в 9 утра?" },
          { en: "Will she be cooking dinner?", ru: "Она будет готовить ужин?" },
          { en: "What will they be doing at 5 PM?", ru: "Что они будут делать в 5 вечера?" },
        ],
      },
    },
    rules: [
      {
        rule: "Описывает процесс в конкретный момент будущего: at 5 PM tomorrow, this time next week.",
        examples: [
          { en: "At 8 PM I will be watching a film.", ru: "В 8 вечера я буду смотреть фильм." },
          { en: "This time next year I will be living in London.", ru: "В это время в следующем году я буду жить в Лондоне." },
          { en: "She will be working while we are on holiday.", ru: "Она будет работать, пока мы в отпуске." },
        ],
      },
      {
        rule: "Вежливый вопрос о планах: Will you be using the car tonight?",
        examples: [
          { en: "Will you be needing the computer later?", ru: "Тебе понадобится компьютер позже?" },
          { en: "Will she be joining us for dinner?", ru: "Она присоединится к нам на ужин?" },
          { en: "Will they be staying long?", ru: "Они надолго останутся?" },
        ],
      },
    ],
  },
  {
    slug: "future-perfect",
    title: "Future Perfect",
    titleRu: "Будущее совершенное",
    group: "Future",
    groupRu: "Будущие времена",
    level: "B2",
    icon: "layers",
    purpose: "Действие завершится к определённому моменту в будущем.",
    example: { en: "I will have worked by 6 PM.", ru: "Я закончу работать к 6 вечера." },
    formulas: {
      affirmative: "S + will have + V3",
      negative: "S + will not + have + V3",
      question: "Will + S + have + V3?",
      examples: {
        affirmative: [
          { en: "I will have worked by 6 PM.", ru: "Я закончу работать к 6 вечера." },
          { en: "She will have finished the book by Friday.", ru: "К пятнице она закончит книгу." },
          { en: "They will have left by the time we arrive.", ru: "К моменту нашего приезда они уже уедут." },
        ],
        negative: [
          { en: "I won't have finished by then.", ru: "К тому времени я ещё не закончу." },
          { en: "She won't have completed the course.", ru: "Она не закончит курс." },
          { en: "We won't have saved enough money.", ru: "Мы не накопим достаточно денег." },
        ],
        question: [
          { en: "Will you have done it by Monday?", ru: "Ты сделаешь это к понедельнику?" },
          { en: "Will she have graduated by June?", ru: "Она закончит учёбу к июню?" },
          { en: "Will they have arrived by 8 PM?", ru: "Они приедут к 8 вечера?" },
        ],
      },
    },
    rules: [
      {
        rule: "Маркеры: by, by the time, before — указывают крайний срок в будущем.",
        examples: [
          { en: "By next month I will have saved $1000.", ru: "К следующему месяцу я накоплю 1000 долларов." },
          { en: "By the time you wake up, I will have left.", ru: "К тому времени как ты проснёшься, я уже уйду." },
          { en: "She will have cooked before guests arrive.", ru: "Она приготовит до прихода гостей." },
        ],
      },
      {
        rule: "Подчёркивает, что действие будет завершено к определённому моменту.",
        examples: [
          { en: "In two hours I will have finished this report.", ru: "Через два часа я закончу этот отчёт." },
          { en: "By 2030 scientists will have found a cure.", ru: "К 2030 году учёные найдут лекарство." },
          { en: "He will have read all the books by summer.", ru: "К лету он прочитает все книги." },
        ],
      },
    ],
  },
  {
    slug: "future-perfect-continuous",
    title: "Future Perfect Continuous",
    titleRu: "Будущее совершенное длительное",
    group: "Future",
    groupRu: "Будущие времена",
    level: "C1",
    icon: "clock",
    purpose: "Действие будет длиться до определённого момента в будущем.",
    example: {
      en: "By next year, I will have been working here for 5 years.",
      ru: "К следующему году исполнится 5 лет, как я здесь работаю.",
    },
    formulas: {
      affirmative: "S + will have been + V-ing",
      negative: "S + will not + have been + V-ing",
      question: "Will + S + have been + V-ing?",
      examples: {
        affirmative: [
          {
            en: "By next year, I will have been working here for 5 years.",
            ru: "К следующему году исполнится 5 лет, как я здесь работаю.",
          },
          { en: "By June she will have been studying for six months.", ru: "К июню она будет учиться уже шесть месяцев." },
          { en: "They will have been waiting for two hours by then.", ru: "К тому времени они будут ждать уже два часа." },
        ],
        negative: [
          { en: "I won't have been living here long.", ru: "Я буду жить здесь недолго (к тому моменту)." },
          { en: "She won't have been working there for a year.", ru: "Она не проработает там и года." },
          { en: "We won't have been travelling for more than a week.", ru: "Мы не будем путешествовать больше недели." },
        ],
        question: [
          { en: "How long will you have been learning English by 2027?", ru: "Как долго ты будешь учить английский к 2027 году?" },
          { en: "Will she have been teaching for ten years?", ru: "Она будет преподавать уже десять лет?" },
          { en: "Will they have been building the house for a year?", ru: "Они будут строить дом уже год?" },
        ],
      },
    },
    rules: [
      {
        rule: "Акцент на длительности процесса к моменту в будущем — часто с for.",
        examples: [
          { en: "By December I will have been working here for 3 years.", ru: "К декабрю я буду работать здесь 3 года." },
          { en: "She will have been running for an hour by 7 AM.", ru: "К 7 утра она будет бегать уже час." },
          { en: "They will have been married for 20 years next spring.", ru: "Весной следующего года им будет 20 лет в браке." },
        ],
      },
      {
        rule: "Показывает, сколько времени действие будет продолжаться к определённой дате.",
        examples: [
          { en: "In 2030 I will have been driving for 15 years.", ru: "В 2030 году я буду водить уже 15 лет." },
          { en: "By graduation he will have been studying medicine for 6 years.", ru: "К выпуску он будет учиться на врача 6 лет." },
          { en: "Next month we will have been friends for a decade.", ru: "В следующем месяце нам будет 10 лет дружбы." },
        ],
      },
    ],
  },
  {
    slug: "adverbs-of-frequency",
    title: "Adverbs of Frequency",
    titleRu: "Наречия частотности",
    group: "Grammar",
    groupRu: "Грамматика",
    level: "A1",
    icon: "book",
    purpose: "Показывают, как часто происходит действие (Adverbs of Frequency).",
    example: { en: "I usually drink coffee in the morning.", ru: "Я обычно пью кофе по утрам." },
    rules: [
      {
        rule: "Ставятся перед смысловым глаголом в Present Simple и других простых временах.",
        examples: [
          { en: "I always brush my teeth.", ru: "Я всегда чищу зубы." },
          { en: "She usually takes the bus.", ru: "Она обычно ездит на автобусе." },
          { en: "They never eat fast food.", ru: "Они никогда не едят фастфуд." },
        ],
      },
      {
        rule: "После глагола to be (am, is, are, was, were).",
        examples: [
          { en: "He is never late.", ru: "Он никогда не опаздывает." },
          { en: "She is always happy.", ru: "Она всегда счастлива." },
          { en: "They were often tired.", ru: "Они часто уставали." },
        ],
      },
      {
        rule: "В вопросах и отрицаниях — после подлежащего, перед смысловым глаголом.",
        examples: [
          { en: "Do you often travel?", ru: "Ты часто путешествуешь?" },
          { en: "She doesn't usually cook.", ru: "Она обычно не готовит." },
          { en: "Are you always so busy?", ru: "Ты всегда так занят?" },
        ],
      },
      {
        rule: "Sometimes, usually, often можно ставить в начало предложения для акцента.",
        examples: [
          { en: "Sometimes I go for a walk.", ru: "Иногда я гуляю." },
          { en: "Usually she wakes up early.", ru: "Обычно она встаёт рано." },
          { en: "Often we eat together.", ru: "Часто мы едим вместе." },
        ],
      },
    ],
    extra: [
      {
        title: "Шкала частотности",
        content:
          "always (всегда, 100%) → usually (обычно, 80–90%) → often (часто, 60–70%) → sometimes (иногда, 30–50%) → seldom/rarely (редко, 10–20%) → never (никогда, 0%)",
      },
      {
        title: "Примеры по шкале",
        content:
          "I always wake up at 7. — Я всегда встаю в 7.\nI usually have cereal for breakfast. — Обычно я ем хлопья на завтрак.\nI often go to the gym. — Я часто хожу в спортзал.\nI sometimes watch films at night. — Иногда я смотрю фильмы ночью.\nI rarely eat sweets. — Я редко ем сладкое.\nI never smoke. — Я никогда не курю.",
      },
      {
        title: "Обозначения в формулах",
        content:
          "V — смысловой глагол (инфинитив без to). V2/V-ed — прошедшее время. V3 — причастие прошедшего. V-ing — форма с -ing. S — подлежащее.",
      },
    ],
  },
  {
    slug: "relative-clauses",
    title: "Relative Clauses",
    titleRu: "Относительные придаточные предложения",
    group: "Grammar",
    groupRu: "Грамматика",
    level: "B1",
    icon: "layers",
    purpose:
      "Описывают существительное (человека, предмет, место) — отвечают на вопрос «какой?» / «который?». Делают речь более связной и «взрослой».",
    example: {
      en: "I know a manager who speaks three languages.",
      ru: "Я знаю менеджера, который говорит на трёх языках.",
    },
    formulaLabels: {
      affirmative: "Местоимения-связки",
      negative: "Сокращённая форма",
      question: "В вопросах",
    },
    formulas: {
      affirmative: "N + who/which/that/whose/where + (S) + V",
      negative: "N + (who/which/that) + V — местоимение можно опустить",
      question: "Вопрос + N + who/which/that + ...?",
      note: "Who — люди. Which — предметы и животные. That — универсально (разговорная речь). Whose — принадлежность. Where — места.",
      examples: {
        affirmative: [
          { en: "I know a manager who speaks three languages.", ru: "Я знаю менеджера, который говорит на трёх языках." },
          { en: "The company which makes software is in Tashkent.", ru: "Компания, которая производит софт, находится в Ташкенте." },
          { en: "This is the client whose project we finished yesterday.", ru: "Это клиент, чей проект мы закончили вчера." },
        ],
        negative: [
          { en: "The contract you signed is on the table.", ru: "Контракт, [который] вы подписали, на столе." },
          { en: "The book I bought is very interesting.", ru: "Книга, [которую] я купил, очень интересная." },
          { en: "The people we met were friendly.", ru: "Люди, [которых] мы встретили, были дружелюбными." },
        ],
        question: [
          { en: "Do you know the man who called you?", ru: "Ты знаешь мужчину, который тебе звонил?" },
          { en: "Where is the file that we need?", ru: "Где файл, который нам нужен?" },
          { en: "Who is the woman whose car is parked outside?", ru: "Кто эта женщина, чья машина припаркована снаружи?" },
        ],
      },
    },
    rules: [
      {
        rule: "Who — для людей (который / которая / которые).",
        examples: [
          { en: "The woman who lives next door is a doctor.", ru: "Женщина, которая живёт по соседству, — врач." },
          { en: "I met a student who studies at Cambridge.", ru: "Я познакомился со студентом, который учится в Кембридже." },
          { en: "She is the teacher who helped me.", ru: "Она — учитель, который мне помог." },
        ],
      },
      {
        rule: "Which — для предметов и животных. That — универсальная замена who/which в разговорной речи.",
        examples: [
          { en: "The phone which I bought is broken.", ru: "Телефон, который я купил, сломан." },
          { en: "The dog that barks all night belongs to our neighbour.", ru: "Собака, которая лает всю ночь, принадлежит нашему соседу." },
          { en: "This is the laptop that I use for work.", ru: "Это ноутбук, который я использую для работы." },
        ],
      },
      {
        rule: "Whose — показывает принадлежность (чей / чья / чьи). Where — для мест (где / в котором).",
        examples: [
          { en: "The man whose wallet was stolen called the police.", ru: "Мужчина, чей кошелёк украли, вызвал полицию." },
          { en: "This is the house where I grew up.", ru: "Это дом, где я вырос." },
          { en: "The café where we had lunch was closed.", ru: "Кафе, где мы обедали, было закрыто." },
        ],
      },
      {
        rule: "Лайфхак: who/which/that можно опустить, если после связки сразу идёт другое подлежащее. Если сразу глагол — опускать нельзя.",
        examples: [
          { en: "The man who called you is here. (нельзя опустить)", ru: "Мужчина, который звонил вам, здесь." },
          { en: "The contract (that) you signed is valid. (можно опустить)", ru: "Контракт, [который] вы подписали, действителен." },
          { en: "The emails (which) she sent were urgent. (можно опустить)", ru: "Письма, [которые] она отправила, были срочными." },
        ],
      },
    ],
    extra: [
      {
        title: "Как объединять короткие фразы",
        content:
          "I know a manager. He speaks three languages.\n→ I know a manager who speaks three languages.\n\nThe company makes software. It is located in Tashkent.\n→ The company which makes software is located in Tashkent.",
      },
    ],
  },
  {
    slug: "defining-non-defining-clauses",
    title: "Defining & Non-defining Clauses",
    titleRu: "Ограничительные и описательные придаточные",
    group: "Grammar",
    groupRu: "Грамматика",
    level: "B2",
    icon: "book",
    purpose:
      "Defining — определяет предмет (без этой части непонятно, о ком/чём речь). Non-defining — добавочная информация, которую можно убрать без потери смысла. В английском запятая полностью меняет значение.",
    example: {
      en: "The employees who speak English will get a bonus.",
      ru: "Сотрудники, которые говорят по-английски, получат бонус. (только они, не все)",
    },
    formulaLabels: {
      affirmative: "Defining (без запятых)",
      negative: "Non-defining (запятые с двух сторон)",
      question: "Тест-индикатор: нужна ли запятая?",
    },
    formulas: {
      affirmative: "N + who/which/that + ...  (БЕЗ запятых, that можно)",
      negative: "N, + who/which/where/whose + ..., + V  (запятые обязательны, that нельзя)",
      question: "Убери придаточное → поймут ли, о ком/чём речь?",
      note: "Defining склеивает описание с существительным. Non-defining — как скобки с дополнительным фактом «кстати».",
      examples: {
        affirmative: [
          {
            en: "The employees who speak English will get a bonus.",
            ru: "Бонус получат только те сотрудники, которые знают английский. (остальные — нет)",
          },
          {
            en: "The book that I bought yesterday is boring.",
            ru: "Скучная именно та книга, которую купил вчера. (без пояснения смысл теряется)",
          },
          {
            en: "The cars which failed the safety test were recalled.",
            ru: "Отозвали только машины, провалившие тест. (хорошие остались в салонах)",
          },
        ],
        negative: [
          {
            en: "My boss, who speaks English, loves coffee.",
            ru: "У меня один босс. То, что он говорит по-английски — просто попутный факт.",
          },
          {
            en: "Yesterday I met Alice, who told me the news.",
            ru: "Элис одна такая — запятая нужна. (имя собственное = уже понятно, о ком речь)",
          },
          {
            en: "The cars, which failed the safety test, were recalled.",
            ru: "Отозвали все машины из партии, и все они провалили тест. (другой смысл!)",
          },
        ],
        question: [
          {
            en: "My mother, who lives in London, is visiting. → запятая (мама одна)",
            ru: "Моя мама (кстати, живёт в Лондоне) приезжает в гости.",
          },
          {
            en: "The students who passed the exam celebrated. → без запятой (какие студенты?)",
            ru: "Студенты, которые сдали экзамен, праздновали. (не все студенты)",
          },
          {
            en: "Microsoft, which was founded in 1975, is huge. → запятая (компания известна)",
            ru: "Microsoft (основана в 1975) — огромная компания.",
          },
        ],
      },
    },
    rules: [
      {
        rule: "Defining (ограничительные): критически важная информация. Без неё предложение теряет смысл или становится слишком общим. Запятые НЕ нужны.",
        examples: [
          {
            en: "The employees who speak English will get a bonus.",
            ru: "Убрали «who speak English» → «Сотрудники получат бонус» — смысл изменился (как будто всем).",
          },
          {
            en: "He married his girlfriend who lives in New York.",
            ru: "Возможно, было несколько девушек — женился на той, что в Нью-Йорке.",
          },
          {
            en: "The manager that I interviewed yesterday accepted the offer.",
            ru: "Какой менеджер? Тот, с которым я вчера собеседовал. Без этого непонятно.",
          },
        ],
      },
      {
        rule: "Non-defining (описательные): добавочная информация «между прочим». Можно убрать — суть останется. Запятые ОБЯЗАТЕЛЬНЫ с двух сторон (как скобки).",
        examples: [
          {
            en: "My boss, who speaks English, loves coffee.",
            ru: "Убрали «who speaks English» → «My boss loves coffee» — суть ясна.",
          },
          {
            en: "He married his girlfriend, who lives in New York.",
            ru: "Одна девушка, на ней женился. Живёт в Нью-Йорке — просто доп. факт.",
          },
          {
            en: "Our CEO, who started the company in 2010, is retiring.",
            ru: "CEO один и понятен — год основания компании лишь дополнение.",
          },
        ],
      },
      {
        rule: "That в Defining — можно (who/which → that). В Non-defining — that ЗАПРЕЩЕНО, только who, which, where, whose.",
        examples: [
          { en: "The people that work here are friendly. ✓ (defining)", ru: "Люди, которые работают здесь, дружелюбны." },
          { en: "My sister, who lives abroad, is visiting. ✓ (non-defining)", ru: "Моя сестра, которая живёт за границей, приезжает." },
          { en: "My sister, that lives abroad, is visiting. ✗ (ошибка!)", ru: "С that в non-defining так писать нельзя." },
        ],
      },
      {
        rule: "Главный тест: убери придаточное и спроси — «Поймут ли, о каком ИМЕННО человеке/предмете речь?» Имя собственное или уникальный объект (my boss, our CEO) → запятые. Общее слово (students, the book) без пояснения → без запятых.",
        examples: [
          { en: "Yesterday I met Alice, who told me the news.", ru: "Элис одна → запятая нужна." },
          { en: "The book that I bought yesterday is boring.", ru: "Какая книга? Без пояснения неясно → без запятой." },
          { en: "London, which is the capital of the UK, is expensive.", ru: "Лондон известен → запятая нужна." },
        ],
      },
    ],
    extra: [
      {
        title: "Главный секрет в двух словах",
        content:
          "Defining — ОПРЕДЕЛЯЕТ (ограничивает) предмет.\nNon-defining — НЕ определяет, просто добавляет факт.\n\nВ русском «который» почти всегда с запятой. В английском запятая полностью меняет смысл!",
      },
      {
        title: "Как запятая меняет реальность",
        content:
          "He married his girlfriend who lives in New York.\n→ Женился на той, что в Нью-Йорке (defining, без запятых)\n\nHe married his girlfriend, who lives in New York.\n→ Одна девушка, кстати живёт в Нью-Йорке (non-defining, с запятыми)\n\nThe cars which failed the safety test were recalled.\n→ Только провалившие тест (defining)\n\nThe cars, which failed the safety test, were recalled.\n→ Все машины отозвали, и все провалили тест (non-defining)",
      },
    ],
  },
  {
    slug: "participle-clauses",
    title: "Participle Clauses",
    titleRu: "Причастные и деепричастные обороты",
    group: "Grammar",
    groupRu: "Грамматика",
    level: "B2",
    icon: "clock",
    purpose:
      "Сокращают предложения, убирая «который», «потому что», «когда» — делают речь динамичной и беглой. Часто это сильно сокращённые Relative Clauses.",
    example: {
      en: "The man working here is my partner.",
      ru: "Мужчина, работающий здесь, — мой партнёр.",
    },
    formulaLabels: {
      affirmative: "Present Participle (-ing)",
      negative: "Past Participle (V3)",
      question: "Причина и одновременность",
    },
    formulas: {
      affirmative: "N + V-ing  (активный залог — «делающий»)",
      negative: "N + V3 / V-ed  (пассивный залог — «сделанный»)",
      question: "V-ing, S + V  (причина / одновременное действие)",
      note: "Present Participle (-ing) — объект сам делает действие. Past Participle (V3) — действие совершают над объектом.",
      examples: {
        affirmative: [
          { en: "The man working here is my partner.", ru: "Мужчина, работающий здесь, — мой партнёр." },
          { en: "People travelling by plane need a ticket.", ru: "Люди, путешествующие самолётом, нуждаются в билете." },
          { en: "The building being constructed will be an office.", ru: "Здание, строящееся [сейчас], будет офисом." },
        ],
        negative: [
          { en: "The report written by our team was sent to the client.", ru: "Отчёт, написанный нашей командой, отправили клиенту." },
          { en: "The letters sent yesterday arrived today.", ru: "Письма, отправленные вчера, пришли сегодня." },
          { en: "The problem caused by the delay is serious.", ru: "Проблема, вызванная задержкой, серьёзная." },
        ],
        question: [
          { en: "Knowing the answer, she answered quickly.", ru: "Зная ответ, она ответила быстро." },
          { en: "He sat at the desk, reading emails.", ru: "Он сидел за столом, читая электронные письма." },
          { en: "Impressed by the presentation, the investor signed the deal.", ru: "Впечатлённый презентацией, инвестор подписал сделку." },
        ],
      },
    },
    rules: [
      {
        rule: "Present Participle (-ing) заменяет Relative Clause с активным залогом: who/which + is/are + V-ing → N + V-ing.",
        examples: [
          { en: "The man who works here → The man working here.", ru: "Мужчина, который работает здесь → Мужчина, работающий здесь." },
          { en: "The students who are waiting outside → The students waiting outside.", ru: "Студенты, которые ждут снаружи → Студенты, ждущие снаружи." },
          { en: "Anyone who wants to join us → Anyone wanting to join us.", ru: "Любой, кто хочет присоединиться → Любой, желающий присоединиться." },
        ],
      },
      {
        rule: "Past Participle (V3) заменяет пассивную Relative Clause: which was/were + V3 → N + V3.",
        examples: [
          { en: "The report which was written by our team → The report written by our team.", ru: "Отчёт, который был написан → Отчёт, написанный нашей командой." },
          { en: "The files which were deleted → The deleted files.", ru: "Файлы, которые были удалены → Удалённые файлы." },
          { en: "The contract signed last week is valid.", ru: "Контракт, подписанный на прошлой неделе, действителен." },
        ],
      },
      {
        rule: "Причастный оборот в начале предложения выражает причину: Because S + V → V-ing, S + V.",
        examples: [
          { en: "Because she knew the answer → Knowing the answer, she answered quickly.", ru: "Так как она знала ответ → Зная ответ, она ответила быстро." },
          { en: "Because he was tired → Feeling tired, he went home early.", ru: "Потому что он устал → Чувствуя усталость, он ушёл домой рано." },
          { en: "Because they had no money → Having no money, they cancelled the trip.", ru: "Так как у них не было денег → Не имея денег, они отменили поездку." },
        ],
      },
      {
        rule: "Золотое правило: у обоих действий должно быть одно подлежащее. Иначе получится «висящая» конструкция.",
        examples: [
          { en: "Walking down the street, I saw a dog. ✓", ru: "Идя по улице, я увидел собаку. ✓ (я шёл, я увидел)" },
          { en: "Walking down the street, a dog bit me. ✗", ru: "Идя по улице, собака меня укусила. ✗ (собака якобы шла)" },
          { en: "Having finished the report, she sent it to the manager. ✓", ru: "Закончив отчёт, она отправила его менеджеру. ✓" },
        ],
      },
    ],
    extra: [
      {
        title: "Relative Clause → Participle Clause",
        content:
          "The letters which were sent yesterday... → The letters sent yesterday...\nPeople who travel by plane... → People travelling by plane...\nThe building that is being constructed... → The building being constructed...",
      },
      {
        title: "Связь двух тем",
        content:
          "Participle Clauses — это часто сильно сокращённые Relative Clauses. Обе темы отвечают на вопрос «Какой?» или «Что делающий?» и помогают объединять короткие фразы в длинные, логичные предложения.",
      },
    ],
  },
  {
    slug: "modal-verbs-passive-voice",
    title: "Modal Verbs in Passive Voice",
    titleRu: "Модальные глаголы в пассивном залоге",
    group: "Grammar",
    groupRu: "Грамматика",
    level: "B2",
    icon: "layers",
    purpose:
      "В активном залоге мы говорим о том, кто совершает действие. В пассивном залоге на первый план выходит предмет или человек, над которым совершается действие. Модальные глаголы (can, must, should и др.) образуют пассив по формуле: модальный + be + V3.",
    example: {
      en: "The info can be found here.",
      ru: "Информацию можно найти здесь.",
    },
    formulaLabels: {
      affirmative: "Основная формула (+)",
      negative: "Отрицание (-)",
      question: "Вопрос (?)",
    },
    formulas: {
      affirmative: "Modal + be + V3  (be всегда в начальной форме!)",
      negative: "Modal + not + be + V3",
      question: "Modal + S + be + V3?",
      note: "Глагол be никогда не меняется на am, is, are, was или were — только be. Исключение: have to — have меняется (has/had), но после него всё равно be + V3.",
      examples: {
        affirmative: [
          { en: "You can find the info here. → The info can be found here.", ru: "Информацию можно найти здесь." },
          { en: "You must do this today. → This must be done today.", ru: "Это должно быть сделано сегодня." },
          { en: "You should send the email. → The email should be sent.", ru: "Письмо следует отправить." },
        ],
        negative: [
          { en: "You cannot modify this file. → This file cannot be modified.", ru: "Этот файл нельзя изменять." },
          { en: "They must not open the door. → The door must not be opened.", ru: "Дверь нельзя открывать." },
          { en: "We shouldn't ignore the rules. → The rules shouldn't be ignored.", ru: "Правила не следует игнорировать." },
        ],
        question: [
          { en: "Should we check the results? → Should the results be checked?", ru: "Нужно ли проверить результаты?" },
          { en: "Can you fix the bug? → Can the bug be fixed?", ru: "Можно ли исправить ошибку?" },
          { en: "Must they approve the plan? → Must the plan be approved?", ru: "Должен ли план быть утверждён?" },
        ],
      },
    },
    rules: [
      {
        rule: "Can (можно / уметь): You can find the info → The info can be found.",
        examples: [
          { en: "You can find the info here.", ru: "Ты можешь найти информацию здесь. (актив)" },
          { en: "The info can be found here.", ru: "Информацию можно найти здесь. (пассив)" },
          { en: "The problem can be solved quickly.", ru: "Проблему можно решить быстро." },
        ],
      },
      {
        rule: "Must (обязан / должно): You must do this → This must be done.",
        examples: [
          { en: "You must do this today.", ru: "Ты должен сделать это сегодня. (актив)" },
          { en: "This must be done today.", ru: "Это должно быть сделано сегодня. (пассив)" },
          { en: "The homework must be submitted by Friday.", ru: "Домашнее задание должно быть сдано к пятнице." },
        ],
      },
      {
        rule: "Should (следует): You should send the email → The email should be sent.",
        examples: [
          { en: "You should send the email.", ru: "Тебе следует отправить письмо. (актив)" },
          { en: "The email should be sent.", ru: "Письмо следует отправить. (пассив)" },
          { en: "The report should be reviewed carefully.", ru: "Отчёт следует проверить внимательно." },
        ],
      },
      {
        rule: "May (возможно / разрешено): We may approve the plan → The plan may be approved.",
        examples: [
          { en: "We may approve the plan.", ru: "Мы можем утвердить план. (актив)" },
          { en: "The plan may be approved.", ru: "План может быть утверждён. (пассив)" },
          { en: "The changes may be announced tomorrow.", ru: "Изменения могут быть объявлены завтра." },
        ],
      },
      {
        rule: "Have to (приходится): We have to wash the car → The car has to be washed. (have меняется, be — нет!)",
        examples: [
          { en: "We have to wash the car.", ru: "Нам нужно помыть машину. (актив)" },
          { en: "The car has to be washed.", ru: "Машину нужно помыть. (пассив)" },
          { en: "The documents had to be signed yesterday.", ru: "Документы нужно было подписать вчера." },
        ],
      },
      {
        rule: "Отрицание: not ставится сразу после модального глагола, перед be.",
        examples: [
          { en: "You cannot modify this file.", ru: "Ты не можешь изменить этот файл. (актив)" },
          { en: "This file cannot be modified.", ru: "Этот файл нельзя изменять. (пассив)" },
          { en: "The rules must not be broken.", ru: "Правила нельзя нарушать." },
        ],
      },
      {
        rule: "Вопрос: модальный глагол выносится на первое место, перед подлежащим.",
        examples: [
          { en: "Should we check the results?", ru: "Нам следует проверить результаты? (актив)" },
          { en: "Should the results be checked?", ru: "Нужно ли проверить результаты? (пассив)" },
          { en: "Can the project be completed on time?", ru: "Можно ли завершить проект вовремя?" },
        ],
      },
    ],
    extra: [
      {
        title: "Активный vs пассивный залог",
        content:
          "Активный залог: фокус на том, КТО делает действие.\nYou must do this today. — Ты должен сделать это.\n\nПассивный залог: фокус на том, НАД ЧЕМ совершается действие.\nThis must be done today. — Это должно быть сделано.",
      },
      {
        title: "Таблица: модальные глаголы в пассиве",
        content:
          "Can: The info can be found here. — Информацию можно найти здесь.\nMust: This must be done today. — Это должно быть сделано сегодня.\nShould: The email should be sent. — Письмо следует отправить.\nMay: The plan may be approved. — План может быть утверждён.\nHave to: The car has to be washed. — Машину нужно помыть.",
      },
      {
        title: "Подсказка для практики",
        content:
          "1. Что является объектом? Поставьте его на первое место: The homework, The project, The car.\n2. Какой модальный глагол нужен по смыслу? must, should, can и т.д.\n3. Добавьте неизменное be + глагол в 3-й форме (V3).",
      },
    ],
  },
];

export const FORMULA_LEGEND = {
  simple: {
    title: "Simple — простые времена",
    description: "Факты, привычки, регулярные действия.",
  },
  continuous: {
    title: "Continuous — длительные",
    description: "Процесс в определённый момент. Маркер: to be + V-ing.",
  },
  perfect: {
    title: "Perfect — совершенные",
    description: "Результат к моменту времени. Маркер: have/has/had + V3.",
  },
  perfectContinuous: {
    title: "Perfect Continuous",
    description: "Длительность до момента. Маркер: have/has/had + been + V-ing.",
  },
};

export function getTenseBySlug(slug: string) {
  return TENSE_TOPICS.find((t) => t.slug === slug) ?? null;
}
