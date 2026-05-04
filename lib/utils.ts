import { arrayUnion, increment } from "firebase/firestore";
import { type LangCode, progressKey } from "@/lib/languages";

export function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? "Just now" : `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

export function masteryColor(m: number) {
  if (m >= 80) return "#34d399";
  if (m >= 50) return "#f59e0b";
  return "#f87171";
}

export function calculateEarnedXp(score: number, total: number, baseXp: number) {
  const pct = Math.round((score / total) * 100);
  if (pct === 100) return baseXp + 5;
  if (pct >= 80) return baseXp;
  if (pct >= 60) return Math.round(baseXp * 0.75);
  return Math.round(baseXp * 0.5);
}

export function buildLessonSaveUpdates(
  earnedXp: number,
  pct: number,
  lang: LangCode,
  id: string,
  title: string,
  langInfo: { flag: string; name: string }
) {
  const currentIdx = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].indexOf(Number(id));
  const nextId = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10][currentIdx + 1];
  const pKey = progressKey(lang, id);

  const updates: Record<string, unknown> = {
    xp: increment(earnedXp),
    lessonsCompleted: increment(1),
    "dailyGoals.completedLesson": true,
    [`lessonProgress.${pKey}`]: "done",
    [`lessonScores.${pKey}`]: pct,
    [`languageXp.${lang}`]: increment(earnedXp),
    recentActivity: arrayUnion({
      action: `${title} – ${pct}%`,
      lang: `${langInfo.flag} ${langInfo.name}`,
      time: new Date().toISOString(),
      xp: `+${earnedXp} XP`,
    }),
  };

  if (nextId) {
    updates[`lessonProgress.${progressKey(lang, nextId)}`] = "active";
  }

  return updates;
}
