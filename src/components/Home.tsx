import { useMemo } from 'react';
import type { Progress, QuizMode, DomainKey } from '../types';
import { DOMAINS, DOMAIN_ORDER, EXAM_INFO } from '../data/domains';
import { ALL_QUESTIONS, getQuestionsByDomain } from '../data/questions';
import { ProgressBar, StatCard } from './ui';

interface HomeProps {
  progress: Progress;
  onStartQuiz: (mode: QuizMode, domain: DomainKey | 'all', count: number, timed: boolean) => void;
}

export function Home({ progress, onStartQuiz }: HomeProps) {
  const stats = useMemo(() => {
    const answeredIds = Object.keys(progress.answered);
    const totalAttempts = Object.values(progress.answered).reduce((s, v) => s + v.correct + v.wrong, 0);
    const totalCorrect = Object.values(progress.answered).reduce((s, v) => s + v.correct, 0);
    const acc = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    const coverage = Math.round((answeredIds.length / ALL_QUESTIONS.length) * 100);
    return { sessions: progress.history.length, acc, coverage, bookmarks: progress.bookmarks.length };
  }, [progress]);

  const domainProgress = useMemo(() => {
    const map: Record<string, { total: number; answered: number; acc: number }> = {};
    DOMAIN_ORDER.forEach((key) => {
      const qs = getQuestionsByDomain(key);
      let answered = 0;
      let correct = 0;
      let attempts = 0;
      qs.forEach((q) => {
        const rec = progress.answered[q.id];
        if (rec) {
          answered += 1;
          correct += rec.correct;
          attempts += rec.correct + rec.wrong;
        }
      });
      map[key] = {
        total: qs.length,
        answered,
        acc: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
      };
    });
    return map;
  }, [progress]);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="mb-8">
        <div className="chip bg-aws/10 text-aws mb-3 font-mono">{EXAM_INFO.code}</div>
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">
          AWS Certified Data Engineer
          <span className="text-aws"> Associate</span>
        </h1>
        <p className="text-ink-3 text-sm">
          データパイプライン・データストア・運用・セキュリティを実戦形式で学習。進捗は自動保存されます。
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        <StatCard value={ALL_QUESTIONS.length} label="総問題数" color="#4a9eff" />
        <StatCard value={stats.sessions} label="受験回数" color="#1ec8b0" />
        <StatCard value={`${stats.coverage}%`} label="学習済" color="#a472f0" />
        <StatCard value={`${stats.acc}%`} label="正答率" color="#ff9900" />
      </div>

      {/* 模擬試験モード */}
      <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2">
        🎯 試験モード
      </h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <button
          className="card card-hover text-left group"
          onClick={() => onStartQuiz('exam', 'all', 65, true)}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white">📝 本番形式 模擬試験</h3>
            <span className="chip bg-rose/15 text-rose">TIMED</span>
          </div>
          <p className="text-sm text-ink-2">
            全{EXAM_INFO.questionCount}問・制限時間{EXAM_INFO.duration}分。本番と同じ条件で実力を測定。合格ライン{EXAM_INFO.passingPercent}%。
          </p>
        </button>
        <button
          className="card card-hover text-left"
          onClick={() => onStartQuiz('practice', 'all', 20, false)}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white">🔀 クイック練習（20問）</h3>
            <span className="chip bg-moss/15 text-moss">PRACTICE</span>
          </div>
          <p className="text-sm text-ink-2">
            全分野からランダム20問。1問ごとに即座に解説を確認しながら学習できます。
          </p>
        </button>
      </div>

      {/* 分野別 */}
      <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2">
        📂 分野別に学習
      </h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {DOMAIN_ORDER.map((key) => {
          const dom = DOMAINS[key];
          const dp = domainProgress[key];
          const coveragePct = dp.total > 0 ? Math.round((dp.answered / dp.total) * 100) : 0;
          return (
            <button
              key={key}
              className="card card-hover text-left relative overflow-hidden"
              onClick={() => onStartQuiz('practice', key, dp.total, false)}
            >
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: dom.color }} />
              <div className="flex items-start justify-between mb-1">
                <div className="text-2xl">{dom.icon}</div>
                <span className="chip font-mono" style={{ background: `${dom.color}1a`, color: dom.color }}>
                  {dom.weight}%
                </span>
              </div>
              <div className="font-bold text-white">{dom.name}</div>
              <p className="text-xs text-ink-3 mt-1 mb-3 leading-relaxed">{dom.description}</p>
              <div className="flex items-center gap-2 text-[0.7rem] text-ink-3 font-mono mb-1">
                <span>{dp.total}問</span>
                <span>·</span>
                <span>{dp.answered}問学習済</span>
                {dp.acc > 0 && (
                  <>
                    <span>·</span>
                    <span style={{ color: dom.color }}>正答{dp.acc}%</span>
                  </>
                )}
              </div>
              <ProgressBar percent={coveragePct} color={dom.color} height={4} />
            </button>
          );
        })}
      </div>

      {/* 復習・ブックマーク */}
      {(stats.bookmarks > 0 || Object.keys(progress.answered).length > 0) && (
        <>
          <h2 className="text-lg font-black text-white mb-3">🔁 復習</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {stats.bookmarks > 0 && (
              <button
                className="card card-hover text-left"
                onClick={() => onStartQuiz('bookmark', 'all', progress.bookmarks.length, false)}
              >
                <h3 className="font-bold text-white mb-1">⭐ ブックマークした問題</h3>
                <p className="text-sm text-ink-2">{stats.bookmarks}問をまとめて復習</p>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
