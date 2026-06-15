import { useState, useCallback, useEffect } from 'react';
import type { Progress, QuizResult } from '../types';

const STORAGE_KEY = 'dea-c01-master-v1';

const emptyProgress: Progress = {
  history: [],
  answered: {},
  bookmarks: [],
};

function load(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress;
    const parsed = JSON.parse(raw);
    return {
      history: parsed.history ?? [],
      answered: parsed.answered ?? {},
      bookmarks: parsed.bookmarks ?? [],
    };
  } catch {
    return emptyProgress;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // localStorage が使えない環境では黙って無視
    }
  }, [progress]);

  const recordResult = useCallback((result: QuizResult) => {
    setProgress((prev) => {
      const history = [
        {
          date: Date.now(),
          mode: result.mode,
          domain: result.domain,
          correct: result.correct,
          total: result.total,
          score: result.score,
          durationSec: result.durationSec,
        },
        ...prev.history,
      ].slice(0, 100);

      const answered = { ...prev.answered };
      result.details.forEach((d) => {
        const rec = answered[d.questionId] ?? { correct: 0, wrong: 0, lastAnswered: 0 };
        if (d.correct) rec.correct += 1;
        else rec.wrong += 1;
        rec.lastAnswered = Date.now();
        answered[d.questionId] = rec;
      });

      return { ...prev, history, answered };
    });
  }, []);

  const toggleBookmark = useCallback((questionId: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarks.includes(questionId);
      return {
        ...prev,
        bookmarks: exists
          ? prev.bookmarks.filter((id) => id !== questionId)
          : [...prev.bookmarks, questionId],
      };
    });
  }, []);

  const reset = useCallback(() => {
    setProgress(emptyProgress);
  }, []);

  return { progress, recordResult, toggleBookmark, reset };
}
