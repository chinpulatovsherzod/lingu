export type SrsRating = "again" | "hard" | "good" | "easy";

export function sm2Update(
  easeFactor: number,
  intervalDays: number,
  reviewCount: number,
  rating: SrsRating
) {
  let ef = easeFactor;
  let interval = intervalDays;
  let count = reviewCount;

  const qualityMap: Record<SrsRating, number> = {
    again: 1,
    hard: 3,
    good: 4,
    easy: 5,
  };
  const q = qualityMap[rating];

  if (q < 3) {
    count = 0;
    interval = 0;
  } else {
    if (count === 0) interval = 1;
    else if (count === 1) interval = 3;
    else interval = Math.round(interval * ef);
    count += 1;
  }

  ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ef < 1.3) ef = 1.3;

  const next = new Date();
  if (rating === "again") next.setHours(next.getHours() + 4);
  else next.setDate(next.getDate() + Math.max(interval, 1));

  return { easeFactor: ef, intervalDays: interval, reviewCount: count, nextReviewDate: next };
}
