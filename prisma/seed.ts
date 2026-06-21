import { EnglishLevel, LessonType, StepType, LearningGoal, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

const LEVELS: EnglishLevel[] = ["A1", "A2", "B1", "B2", "C1"];
const LESSON_TYPES: LessonType[] = [
  "READING",
  "LISTENING",
  "WRITING",
  "SPEAKING",
  "GRAMMAR",
  "VOCABULARY",
];

const SAMPLE_WORDS = [
  ["hello", "noun", "A greeting", "Hello, how are you?", "A1"],
  ["beautiful", "adjective", "Very attractive", "What a beautiful day!", "A2"],
  ["achieve", "verb", "To succeed in doing something", "She achieved her goals.", "B1"],
  ["nevertheless", "adverb", "In spite of that", "It was hard; nevertheless, he continued.", "B2"],
  ["sophisticated", "adjective", "Complex and refined", "A sophisticated argument.", "C1"],
] as const;

async function main() {
  console.log("Seeding Lingu...");

  await prisma.userAchievement.deleteMany();
  await prisma.userWord.deleteMany();
  await prisma.userLessonProgress.deleteMany();
  await prisma.userStatsDaily.deleteMany();
  await prisma.ieltsTest.deleteMany();
  await prisma.lessonStep.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.word.deleteMany();
  await prisma.grammarTopic.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const demo = await prisma.user.create({
    data: {
      email: "demo@lingu.uz",


      name: "Demo Student",
      passwordHash: await bcrypt.hash("demo1234", 10),
      englishLevel: "B1",
      learningGoal: LearningGoal.IELTS,
      ieltsTargetBand: 7,
      totalXp: 1250,
      currentLevel: 5,
      streakCount: 3,
      lastActiveDate: new Date(),
    },
  });

  let order = 0;
  for (const type of LESSON_TYPES) {
    for (let i = 0; i < 2; i++) {
      const level = LEVELS[(order + i) % LEVELS.length];
      const lesson = await prisma.lesson.create({
        data: {
          title: `${type} Practice ${i + 1} (${level})`,
          description: `Interactive ${type.toLowerCase()} lesson for ${level} learners.`,
          type,
          cefrLevel: level,
          durationMinutes: 15 + i * 5,
          xpReward: 120 + i * 20,
          orderIndex: order++,
          isIelts: type === "READING" && level === "C1",
        },
      });

      await prisma.lessonStep.createMany({
        data: [
          {
            lessonId: lesson.id,
            stepType: StepType.EXPLANATION,
            orderIndex: 0,
            content: {
              title: "Introduction",
              body: `Welcome to this ${type} lesson. Focus on clarity and accuracy.`,
            },
          },
          {
            lessonId: lesson.id,
            stepType: StepType.VOCABULARY,
            orderIndex: 1,
            content: {
              word: SAMPLE_WORDS[i % SAMPLE_WORDS.length][0],
              part_of_speech: SAMPLE_WORDS[i % SAMPLE_WORDS.length][1],
              definition: SAMPLE_WORDS[i % SAMPLE_WORDS.length][2],
              example: SAMPLE_WORDS[i % SAMPLE_WORDS.length][3],
            },
          },
          {
            lessonId: lesson.id,
            stepType: StepType.MCQ,
            orderIndex: 2,
            content: {
              question: "Choose the correct sentence.",
              options: [
                "She go to school every day.",
                "She goes to school every day.",
                "She going to school every day.",
                "She gone to school every day.",
              ],
              correct_index: 1,
              explanation: "Third person singular takes -s: goes.",
            },
          },
          {
            lessonId: lesson.id,
            stepType: StepType.FILL_IN_BLANK,
            orderIndex: 3,
            content: {
              sentence: "I ___ learning English every day.",
              answer: "enjoy",
              explanation: "Present simple: enjoy.",
            },
          },
        ],
      });
    }
  }

  const wordList: { word: string; pos: string; def: string; ex: string; level: EnglishLevel; ielts?: boolean }[] = [];
  const bases = ["learn", "study", "practice", "improve", "speak", "read", "write", "listen", "think", "work"];
  LEVELS.forEach((level, li) => {
    bases.forEach((b, bi) => {
      wordList.push({
        word: `${b}${bi + li}`,
        pos: bi % 2 === 0 ? "verb" : "noun",
        def: `Definition of ${b} at ${level}`,
        ex: `Example with ${b} at ${level}.`,
        level,
        ielts: li >= 3 && bi < 3,
      });
    });
  });

  let wordIndex = 0;
  for (const w of wordList.slice(0, 100)) {
    const word = await prisma.word.create({
      data: {
        word: w.word,
        partOfSpeech: w.pos,
        definition: w.def,
        exampleSentence: w.ex,
        cefrLevel: w.level,
        isIeltsAcademic: !!w.ielts,
      },
    });
    if (wordIndex < 15) {
      await prisma.userWord.create({
        data: {
          userId: demo.id,
          wordId: word.id,
          masteryStatus: wordIndex < 5 ? "MASTERED" : "LEARNING",
          reviewCount: 2,
        },
      });
    }
    wordIndex++;
  }

  const grammarTopics = [
    { slug: "perfect-tenses", title: "Perfect Tenses", level: "B1" as EnglishLevel },
    { slug: "conditionals", title: "Conditionals", level: "B1" as EnglishLevel },
    { slug: "passive-voice", title: "Passive Voice", level: "B2" as EnglishLevel },
    { slug: "modal-verbs", title: "Modal Verbs", level: "A2" as EnglishLevel },
    { slug: "articles", title: "Articles", level: "A1" as EnglishLevel },
  ];

  for (let i = 0; i < grammarTopics.length; i++) {
    const g = grammarTopics[i];
    await prisma.grammarTopic.create({
      data: {
        slug: g.slug,
        title: g.title,
        description: `Master ${g.title} with examples and exercises.`,
        cefrLevel: g.level,
        orderIndex: i,
        content: {
          body: `${g.title} are essential at ${g.level} level. Study the rules and practice daily.`,
          examples: [`Example 1 for ${g.title}.`, `Example 2 for ${g.title}.`],
        },
      },
    });
  }

  const achievements = [
    { slug: "first-lesson", title: "First Lesson", description: "Complete your first lesson", icon: "book", xp: 50 },
    { slug: "week-warrior", title: "Week Warrior", description: "7-day study streak", icon: "flame", xp: 100 },
    { slug: "vocab-master", title: "Vocab Master", description: "Learn 1000 words", icon: "languages", xp: 200 },
    { slug: "ielts-ready", title: "IELTS Ready", description: "Reach Band 7+", icon: "graduation", xp: 300 },
  ];

  for (const a of achievements) {
    const ach = await prisma.achievement.create({
      data: {
        slug: a.slug,
        title: a.title,
        description: a.description,
        icon: a.icon,
        xpReward: a.xp,
      },
    });
    if (a.slug === "first-lesson") {
      await prisma.userAchievement.create({
        data: { userId: demo.id, achievementId: ach.id },
      });
    }
  }

  await prisma.ieltsTest.create({
    data: {
      userId: demo.id,
      testType: "MINI",
      readingBand: 6,
      listeningBand: 6.5,
      writingBand: 5.5,
      speakingBand: 6,
      overallBand: 6,
    },
  });

  const firstLesson = await prisma.lesson.findFirst();
  if (firstLesson) {
    await prisma.userLessonProgress.create({
      data: {
        userId: demo.id,
        lessonId: firstLesson.id,
        currentStep: 2,
        isCompleted: false,
      },
    });
  }

  await prisma.$disconnect();
  console.log("Done! Demo login: demo@lingu.uz / demo1234");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
