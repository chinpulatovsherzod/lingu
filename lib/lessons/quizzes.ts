import type { ExplainedQuizItem } from "@/lib/quiz/types";

function q(
  question: string,
  correctIndex: number,
  options: [string, string, string, string],
  explanations: [string, string, string, string]
): ExplainedQuizItem {
  return {
    question,
    correctIndex,
    options: options.map((text, i) => ({ text, explanation: explanations[i] })) as ExplainedQuizItem["options"],
  };
}

export const LESSON_QUIZZES: Record<string, ExplainedQuizItem[]> = {
  "modal-verbs-passive-voice": [
    q(
      "Выберите верный пассив: «You can find the info here.»",
      1,
      [
        "The info can found here.",
        "The info can be found here.",
        "The info can be find here.",
        "The info can been found here.",
      ],
      [
        "После can нужно be + V3. Без be пассив невозможен.",
        "Верно: can + be + V3 (found). be остаётся в начальной форме.",
        "После be идёт третья форма (found), а не инфинитив find.",
        "После модального глагола используется be, а не been.",
      ]
    ),
    q(
      "Переведите в пассив: «You must do this today.»",
      0,
      [
        "This must be done today.",
        "This must done today.",
        "This must be do today.",
        "This must being done today.",
      ],
      [
        "must + be + V3 — классическая формула пассива с модальным глаголом.",
        "Пропущен обязательный be между must и V3.",
        "После be нужна третья форма done, а не do.",
        "После must не используется being — только be + V3.",
      ]
    ),
    q(
      "Отрицание: «You cannot modify this file.» → пассив:",
      2,
      [
        "This file cannot modified.",
        "This file can not be modify.",
        "This file cannot be modified.",
        "This file cannot be modify.",
      ],
      [
        "not ставится после cannot, но be всё равно обязателен: cannot be modified.",
        "После be нужна V3 (modified), а не modify.",
        "Верно: not после модального глагола, затем be + V3.",
        "modify — неправильная форма; нужно modified (V3).",
      ]
    ),
    q(
      "Вопрос: «Should we check the results?» → пассив:",
      1,
      [
        "Should the results checked?",
        "Should the results be checked?",
        "Should be the results checked?",
        "Should the results be check?",
      ],
      [
        "Пропущен be: should + S + be + V3.",
        "Верно: модальный глагол в начале, затем подлежащее + be + V3.",
        "Порядок слов нарушен — подлежащее должно стоять сразу после should.",
        "После be нужна третья форма checked.",
      ]
    ),
    q(
      "«We have to wash the car.» → пассив. Обратите внимание на have:",
      0,
      [
        "The car has to be washed.",
        "The car have to be washed.",
        "The car has to be wash.",
        "The car has to washed.",
      ],
      [
        "have меняется на has (the car), но be остаётся в начальной форме + washed.",
        "С The car единственное число — has, не have.",
        "После be нужна V3 washed.",
        "Пропущен be между has to и V3.",
      ]
    ),
  ],
  "present-simple": [
    q(
      "Choose the correct form: «She ______ to work every day.»",
      1,
      ["go", "goes", "going", "gone"],
      [
        "Для he/she/it в Present Simple глагол получает -s: goes.",
        "Верно: she goes — третье лицо единственного числа.",
        "going — форма Continuous, не Simple.",
        "gone — причастие, не подходит для Simple.",
      ]
    ),
  ],
  "present-continuous": [
    q(
      "«They ______ dinner right now.»",
      1,
      ["cook", "are cooking", "cooked", "have cooked"],
      [
        "cook — Simple; right now требует Continuous.",
        "Верно: are cooking — действие сейчас.",
        "cooked — Past Simple.",
        "have cooked — Present Perfect.",
      ]
    ),
  ],
  "present-perfect-continuous": [
    q(
      "«She ______ for two hours.»",
      2,
      ["studies", "is studying", "has been studying", "studied"],
      [
        "studies — Simple, не показывает длительность до сейчас.",
        "is studying — только текущий процесс без «how long».",
        "Верно: has been studying — длительность с прошлого до настоящего.",
        "studied — Past Simple.",
      ]
    ),
  ],
  "present-perfect": [
    q(
      "«I ______ this film already.»",
      2,
      ["see", "saw", "have seen", "am seeing"],
      [
        "see — не показывает завершённость к настоящему.",
        "saw — Past Simple без связи с «сейчас».",
        "Верно: have seen + already — Present Perfect.",
        "am seeing — процесс, не результат.",
      ]
    ),
  ],
  "past-continuous": [
    q(
      "«At 8 pm yesterday I ______ TV.»",
      1,
      ["watch", "was watching", "watched", "have watched"],
      [
        "watch — настоящее.",
        "Верно: was watching — процесс в конкретный момент прошлого.",
        "watched — завершённое действие.",
        "have watched — Present Perfect.",
      ]
    ),
  ],
  "past-simple": [
    q(
      "«We ______ to Paris last year.»",
      1,
      ["go", "went", "have gone", "were going"],
      [
        "go — настоящее время.",
        "Верно: went — завершённое действие в прошлом (last year).",
        "have gone — Present Perfect.",
        "were going — Past Continuous.",
      ]
    ),
  ],
  "past-perfect-continuous": [
    q(
      "«They ______ for an hour before the bus arrived.»",
      2,
      ["wait", "were waiting", "had been waiting", "have waited"],
      [
        "wait — неправильное время.",
        "were waiting — не показывает «до» другого действия.",
        "Верно: had been waiting — длительность ДО arrived.",
        "have waited — Present Perfect.",
      ]
    ),
    q(
      "«He was tired because he ______ all night.»",
      2,
      ["worked", "has worked", "had been working", "was worked"],
      [
        "worked — не подчёркивает длительность процесса.",
        "has worked — Present Perfect.",
        "Верно: had been working — процесс объясняет усталость.",
        "was worked — пассив, не подходит.",
      ]
    ),
    q(
      "«We ______ the API for three hours before we found the bug.»",
      2,
      ["tested", "were testing", "had been testing", "have tested"],
      [
        "tested — Past Simple, без акцента на длительность.",
        "were testing — не «до» другого действия.",
        "Верно: had been testing — три часа процесса до находки бага.",
        "have tested — Present Perfect.",
      ]
    ),
    q(
      "«By 6 PM, I ______ the system for five hours.»",
      2,
      ["integrated", "had integrated", "had been integrating", "was integrating"],
      [
        "integrated — Past Simple.",
        "had integrated — результат, а не длительность.",
        "Верно: had been integrating — важен процесс (5 часов).",
        "was integrating — Past Continuous.",
      ]
    ),
    q(
      "«Her eyes were red — she ______.»",
      2,
      ["cried", "has cried", "had been crying", "was cried"],
      [
        "cried — одно действие, не процесс.",
        "has cried — Present Perfect.",
        "Верно: had been crying — видимый результат процесса.",
        "was cried — пассив, ошибка.",
      ]
    ),
  ],
  "past-perfect": [
    q(
      "«By the time the teacher arrived, we ______ the problem.»",
      2,
      ["solve", "solved", "had solved", "have solved"],
      [
        "solve — неправильное время.",
        "solved — Past Simple; нужно «до» другого прошлого действия.",
        "Верно: had solved — действие завершилось ДО arrived.",
        "have solved — Present Perfect, не привязан к прошлому событию.",
      ]
    ),
    q(
      "«I ______ the report before the meeting started.»",
      1,
      ["finish", "had finished", "have finished", "was finishing"],
      [
        "finish — неправильная форма.",
        "Верно: had finished — отчёт готов ДО начала собрания.",
        "have finished — Present Perfect.",
        "was finishing — Past Continuous.",
      ]
    ),
    q(
      "«She ______ never ______ sushi before last night.»",
      1,
      ["has / eaten", "had / eaten", "did / eat", "was / eating"],
      [
        "has / eaten — связь с настоящим.",
        "Верно: had / eaten — до прошлой ночи.",
        "did / eat — Past Simple без «предпрошедшего».",
        "was / eating — Continuous.",
      ]
    ),
    q(
      "«By 5 PM, I ______ all the tasks.»",
      2,
      ["completed", "have completed", "had completed", "was completing"],
      [
        "completed — Past Simple.",
        "have completed — Present Perfect.",
        "Верно: had completed — результат к 5 вечера.",
        "was completing — процесс, не результат.",
      ]
    ),
    q(
      "«They ______ each other for years before they got married.»",
      2,
      ["knew", "have known", "had known", "were knowing"],
      [
        "knew — Past Simple.",
        "have known — Present Perfect.",
        "Верно: had known — state verb, до свадьбы.",
        "were knowing — state verb нельзя в Continuous.",
      ]
    ),
  ],
  "future-continuous": [
    q(
      "«This time tomorrow I ______ on a plane.»",
      1,
      ["fly", "will be flying", "will fly", "am flying"],
      [
        "fly — нет маркера будущего.",
        "Верно: will be flying — процесс в будущий момент.",
        "will fly — Future Simple (факт, не процесс).",
        "am flying — настоящее.",
      ]
    ),
  ],
  "future-perfect": [
    q(
      "«By June she ______ her degree.»",
      1,
      ["completes", "will have completed", "will complete", "has completed"],
      [
        "completes — настоящее.",
        "Верно: will have completed — завершится К моменту в будущем.",
        "will complete — Simple, без «к моменту».",
        "has completed — Present Perfect.",
      ]
    ),
  ],
  "future-perfect-continuous": [
    q(
      "«By 2030 I ______ here for 10 years.»",
      1,
      ["work", "will have been working", "will work", "am working"],
      [
        "work — настоящее.",
        "Верно: will have been working — длительность до точки в будущем.",
        "will work — без длительности.",
        "am working — настоящее.",
      ]
    ),
  ],
  "future-simple": [
    q(
      "«I think it ______ tomorrow.»",
      1,
      ["rain", "will rain", "rains", "is raining"],
      [
        "rain — инфинитив без вспомогательного.",
        "Верно: will rain — прогноз.",
        "rains — Present Simple для фактов, не прогноза.",
        "is raining — настоящий процесс.",
      ]
    ),
  ],
  "adverbs-of-frequency": [
    q(
      "«She ______ late for meetings.» (never)",
      1,
      ["is never", "never is", "never", "is not never"],
      [
        "is never — порядок неверный; never перед is.",
        "Верно: never is — наречие после подлежащего, перед to be.",
        "never без глагола — неполное предложение.",
        "двойное отрицание не нужно.",
      ]
    ),
  ],
  "defining-non-defining-clauses": [
    q(
      "«My brother, who lives in London, is a lawyer.» — какой тип придаточного?",
      0,
      [
        "Non-defining (дополнительная информация, запятые)",
        "Defining (уточняет, какой именно брат)",
        "Ошибка — who нельзя для людей",
        "Ошибка — запятые лишние",
      ],
      [
        "Верно: запятые с обеих сторон — non-defining, информация необязательна.",
        "Defining не использует запятые; здесь они есть.",
        "who как раз используется для людей.",
        "Запятые обязательны в non-defining clause.",
      ]
    ),
  ],
  "relative-clauses": [
    q(
      "«The man ______ lives next door is a doctor.»",
      0,
      ["who", "which", "where", "whose"],
      [
        "Верно: who — для людей.",
        "which — для предметов.",
        "where — для мест.",
        "whose — для принадлежности.",
      ]
    ),
  ],
  "participle-clauses": [
    q(
      "Сократите: «The report which was written by our team» →",
      1,
      ["The report writing by our team", "The report written by our team", "The report who written", "The report was written"],
      [
        "writing — активная форма; здесь нужен пассив V3.",
        "Верно: written — Past Participle (пассив).",
        "who — только для людей.",
        "Не сокращено — осталась полная relative clause.",
      ]
    ),
  ],
  "active-passive-voice": [
    q(
      "The letter _____ by the secretary yesterday.",
      0,
      ["was written", "is written", "writes", "was writing"],
      [
        "Правильно: Past Simple passive = was + V3 (written) для ед. числа (the letter).",
        "Неверно: это настоящее время, а действие было вчера (yesterday).",
        "Неверно: это активный залог (пишет), а письмо не может писать само себя.",
        "Неверно: это Past Continuous active, письмо не выполняло действие."
      ]
    ),
    q(
      "The house _____ in 1990.",
      1,
      ["was build", "was built", "built", "were built"],
      [
        "Неверно: build — первая форма, а после was нужна третья (built).",
        "Правильно: was + built (V3) для прошедшего времени пассива в ед. числе.",
        "Неверно: дом не строил ничего сам (активный залог).",
        "Неверно: подлежащее (The house) в единственном числе, поэтому was, а не were."
      ]
    ),
    q(
      "The dinner _____ by 7 PM.",
      0,
      ["will be cooked", "will cook", "is cook", "will cooked"],
      [
        "Правильно: Future Simple passive = will be + cooked (V3).",
        "Неверно: это активный залог, означающий, что ужин сам будет кого-то готовить.",
        "Неверно: некорректная грамматическая конструкция.",
        "Неверно: пропущен глагол be после will."
      ]
    ),
    q(
      "Look! The new bridge _____ right now.",
      0,
      ["is being built", "is building", "built", "has been built"],
      [
        "Правильно: Present Continuous passive = is being + built (V3) для процесса прямо сейчас.",
        "Неверно: мост не строит сам себя (активный залог).",
        "Неверно: Past Simple active не выражает процесс в данный момент.",
        "Неверно: Present Perfect выражает завершенность, а не длящийся процесс."
      ]
    ),
    q(
      "This difficult task _____ by tomorrow.",
      0,
      ["can be completed", "can completed", "can be complete", "could complete"],
      [
        "Правильно: модальный пассив = modal + be + V3 (completed).",
        "Неверно: пропущен обязательный глагол be.",
        "Неверно: нужна третья форма глагола (completed), а не первая (complete).",
        "Неверно: активный залог здесь не подходит по смыслу."
      ]
    ),
    q(
      "The windows _____ every week.",
      1,
      ["clean", "are cleaned", "were cleaned", "is cleaned"],
      [
        "Неверно: окна не могут мыть сами себя (активный залог).",
        "Правильно: Present Simple passive во мн. числе (are cleaned) для регулярных действий.",
        "Неверно: это прошедшее время, а действие происходит регулярно (every week).",
        "Неверно: подлежащее (The windows) во множественном числе, поэтому are, а не is."
      ]
    ),
    q(
      "The experiment _____ by the scientists yesterday.",
      0,
      ["was conducted", "conducted", "is conducted", "was conducting"],
      [
        "Правильно: Past Simple passive = was + V3 (conducted).",
        "Неверно: это активный залог, но эксперимент не проводил сам себя.",
        "Неверно: это настоящее время, а действие было вчера (yesterday).",
        "Неверно: активная форма Past Continuous."
      ]
    ),
    q(
      "A mistake _____ in the report. (вежливый способ сказать об ошибке)",
      0,
      ["was made", "made", "was make", "is making"],
      [
        "Правильно: пассивный залог 'was made' делает фразу вежливее, не обвиняя никого конкретно.",
        "Неверно: это активный залог, требующий указания того, кто сделал ошибку.",
        "Неверно: после was должна быть третья форма глагола (made), а не первая (make).",
        "Неверно: активная форма Present Continuous."
      ]
    ),
    q(
      "Какое предложение грамматически НЕВЕРНО?",
      0,
      ["This car is owned by my brother.", "My brother owns this car.", "The car was repaired yesterday.", "This homework must be done today."],
      [
        "Правильно: глагол состояния 'own' нельзя использовать в пассивном залоге.",
        "Неверно: это правильное активное предложение.",
        "Неверно: пассивный залог в Past Simple построен правильно.",
        "Неверно: пассив с модальным глаголом построен правильно."
      ]
    ),
    q(
      "Our house _____ when we were on vacation.",
      0,
      ["was being painted", "was painting", "painted", "has been painted"],
      [
        "Правильно: Past Continuous passive = was being + V3 для процесса в определенный момент прошлого.",
        "Неверно: дом не красил сам себя.",
        "Неверно: это активная форма прошедшего времени.",
        "Неверно: Present Perfect не сочетается с указанием конкретного прошедшего времени (when we were...)."
      ]
    ),
  ],
};

export function getLessonQuizzes(slug: string): ExplainedQuizItem[] {
  return LESSON_QUIZZES[slug] ?? [];
}
