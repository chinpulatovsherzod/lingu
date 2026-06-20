const LEVEL_THRESHOLDS = Array.from({ length: 50 }, (_, i) => {
  return Math.floor(100 * Math.pow(1.15, i));
});

export function xpForLevel(level: number) {
  return LEVEL_THRESHOLDS[Math.min(Math.max(level - 1, 0), 49)] ?? 5000;
}

export function levelFromXp(totalXp: number) {
  let level = 1;
  let remaining = totalXp;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (remaining < LEVEL_THRESHOLDS[i]) break;
    remaining -= LEVEL_THRESHOLDS[i];
    level = i + 2;
  }
  return Math.min(level, 50);
}

export function xpProgressInLevel(totalXp: number) {
  const level = levelFromXp(totalXp);
  let spent = 0;
  for (let i = 0; i < level - 1; i++) spent += LEVEL_THRESHOLDS[i] ?? 0;
  const current = totalXp - spent;
  const needed = xpForLevel(level);
  return { level, current, needed, percent: Math.min(100, (current / needed) * 100) };
}

export const XP_REWARDS = {
  correctAnswer: 15,
  lessonComplete: 150,
  dailyStreak: 50,
  mockTest: 300,
};
