import { useMemo } from 'react';
import type { Progress } from '../types';
import { DOMAINS, DOMAIN_ORDER } from '../data/domains';
import { getQuestionsByDomain } from '../data/questions';
import { StatCard, ProgressBar } from './ui';
import { formatTime } from '../hooks/useTimer';

export function Stats({ progress }: { progress: Progress }) {
  const overall = useMemo(() => {
    const attempts = Object.values(progress.answered).reduce((s, v) => s + v.correct + v.wrong, 0);
    const correct = Object.values(progress.answered).reduce((s, v) => s + v.correct, 0);
    return {
      attempts,
      correct,
      wrong: attempts - correct,
      acc: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
    };
  }, [progress]);

  const domainStats = useMemo(() => {
    return DOMAIN_ORDER.map((key) => {
      const dom = DOMAINS[key];
      const qs = getQuestionsByDomain(key);
      let correct = 0;
      let attempts = 0;
      qs.forEach((q) => {
        const rec = progress.answered[q.id];
        if (rec) {
          correct += rec.correct;
          attempts += rec.correct + rec.wrong;
        }
      });
      return {
        ...dom,
        attempts,
        correct,
        acc: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
      };
    });
  }, [progress]);

  // 苦手問題（不正解が多い）
  const weakQuestions = useMemo(() => {
    return Object.entries(progress.answered)
      .filter(([, rec]) => rec.wrong > 0)
      .sort((a, b) => b[1].wrong - a[1].wrong)
      .slice(0, 5);
  }, [progress]);

  if (overall.attempts === 0) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-black text-white mb-1">📊 統計</h1>
        <p className="text-ink-3 text-sm mb-6">学習データの分析</p>
        <div className="card text-center py-12">
          <div className="text-5xl mb-4 opacity-40">📭</div>
          <div className="font-bold text-ink-2 mb-1">まだ学習データがありません</div>
          <div className="text-sm text-ink-3">問題を解くと統計が表示されます</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-black text-white mb-1">📊 統計</h1>
      <p className="text-ink-3 text-sm mb-6">学習データの分析</p>

      <div className="grid grid-cols-4 gap-3 mb-8">
        <StatCard value={overall.attempts} label="総解答数" color="#4a9eff" />
        <StatCard value={overall.correct} label="正解" color="#5fc878" />
        <StatCard value={overall.wrong} label="不正解" color="#f0608a" />
        <StatCard value={`${overall.acc}%`} label="正答率" color="#ff9900" />
      </div>

      <h2 className="text-base font-black text-white mb-3">📂 分野別正答率</h2>
      <div className="space-y-2 mb-8">
        {domainStats.map((d) => (
          <div key={d.key} className="card py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{d.icon}</span>
                <div>
                  <strong className="text-sm text-white">{d.name}</strong>
                  <span className="chip ml-2 font-mono" style={{ background: `${d.color}1a`, color: d.color }}>{d.weight}%</span>
                </div>
              </div>
              <span className="font-mono text-sm font-bold" style={{ color: d.color }}>
                {d.attempts > 0 ? `${d.acc}%` : '-'}
              </span>
            </div>
            <ProgressBar percent={d.acc} color={d.color} height={5} />
            <div className="text-[0.7rem] text-ink-3 mt-1 font-mono">{d.correct} / {d.attempts} 問正解</div>
          </div>
        ))}
      </div>

      {weakQuestions.length > 0 && (
        <>
          <h2 className="text-base font-black text-white mb-3">⚠️ 苦手な問題（要復習）</h2>
          <div className="space-y-2 mb-8">
            {weakQuestions.map(([qId, rec]) => {
              const total = rec.correct + rec.wrong;
              const acc = Math.round((rec.correct / total) * 100);
              return (
                <div key={qId} className="card py-3 flex items-center justify-between">
                  <span className="font-mono text-xs text-ink-3">{qId}</span>
                  <span className="text-xs text-rose font-mono">正答{acc}% ({rec.correct}/{total})</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      <h2 className="text-base font-black text-white mb-3">📜 受験履歴</h2>
      {progress.history.length === 0 ? (
        <p className="text-ink-3 text-sm">履歴なし</p>
      ) : (
        <div className="space-y-2">
          {progress.history.slice(0, 15).map((s, i) => {
            const date = new Date(s.date);
            const dStr = `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            const passed = s.score >= 72;
            const label = s.domain === 'all' ? '全分野' : DOMAINS[s.domain]?.name ?? s.domain;
            const modeLabel = s.mode === 'exam' ? '🎯 模試' : s.mode === 'bookmark' ? '⭐ ブクマ' : s.mode === 'review' ? '🔁 復習' : '練習';
            return (
              <div key={i} className="card py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{modeLabel} · {label}</div>
                  <div className="text-[0.7rem] text-ink-3 font-mono">
                    {dStr} · {s.total}問{s.durationSec > 0 && ` · ${formatTime(s.durationSec)}`}
                  </div>
                </div>
                <div className="font-mono text-lg font-black" style={{ color: passed ? '#5fc878' : '#f0608a' }}>
                  {s.score}%
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
