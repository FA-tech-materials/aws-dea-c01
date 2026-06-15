import { useState, useCallback } from 'react';
import type { Page, QuizConfig, QuizMode, QuizResult, DomainKey, Question } from './types';
import { ALL_QUESTIONS, getQuestionsByDomain, getQuestionById } from './data/questions';
import { useProgress } from './hooks/useProgress';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { Quiz } from './components/Quiz';
import { Result } from './components/Result';
import { Stats } from './components/Stats';
import { Study } from './components/Study';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const { progress, recordResult, toggleBookmark } = useProgress();

  const startQuiz = useCallback(
    (mode: QuizMode, domain: DomainKey | 'all', count: number, timed: boolean) => {
      let pool: Question[];
      if (mode === 'bookmark') {
        pool = progress.bookmarks.map((id) => getQuestionById(id)).filter((q): q is Question => !!q);
      } else if (domain === 'all') {
        pool = ALL_QUESTIONS;
      } else {
        pool = getQuestionsByDomain(domain);
      }
      const questions = shuffle(pool).slice(0, Math.min(count, pool.length));
      if (questions.length === 0) {
        alert('出題できる問題がありません。');
        return;
      }
      setQuizConfig({ mode, domain, questions, timed });
      setPage('quiz');
    },
    [progress.bookmarks]
  );

  const startReviewWrong = useCallback(() => {
    if (!quizResult) return;
    const wrongQuestions = quizResult.details
      .filter((d) => !d.correct)
      .map((d) => getQuestionById(d.questionId))
      .filter((q): q is Question => !!q);
    if (wrongQuestions.length === 0) return;
    setQuizConfig({ mode: 'review', domain: 'all', questions: shuffle(wrongQuestions), timed: false });
    setPage('quiz');
  }, [quizResult]);

  const finishQuiz = useCallback(
    (result: QuizResult) => {
      recordResult(result);
      setQuizResult(result);
      setPage('result');
    },
    [recordResult]
  );

  const navigate = useCallback((p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const retryQuiz = useCallback(() => {
    if (!quizResult) return;
    const count = quizResult.total;
    startQuiz(quizResult.mode === 'review' ? 'practice' : quizResult.mode, quizResult.domain, count, quizResult.mode === 'exam');
  }, [quizResult, startQuiz]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header page={page} onNavigate={navigate} />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {page === 'home' && <Home progress={progress} onStartQuiz={startQuiz} />}
        {page === 'quiz' && quizConfig && (
          <Quiz
            config={quizConfig}
            bookmarks={progress.bookmarks}
            onToggleBookmark={toggleBookmark}
            onFinish={finishQuiz}
            onCancel={() => navigate('home')}
          />
        )}
        {page === 'result' && quizResult && (
          <Result
            result={quizResult}
            onRetry={retryQuiz}
            onHome={() => navigate('home')}
            onReviewWrong={startReviewWrong}
          />
        )}
        {page === 'study' && <Study />}
        {page === 'stats' && <Stats progress={progress} />}
      </main>
      <footer className="border-t border-line py-4 text-center text-xs text-ink-3">
        DEA-C01 Master · React + TypeScript + Vite · 学習データはブラウザに保存されます
      </footer>
    </div>
  );
}
