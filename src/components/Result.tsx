import type { QuizResult } from '../types';
import { DOMAINS, EXAM_INFO } from '../data/domains';
import { getQuestionById } from '../data/questions';
import { ProgressBar } from './ui';
import { formatTime } from '../hooks/useTimer';

interface ResultProps {
  result: QuizResult;
  onRetry: () => void;
  onHome: () => void;
  onReviewWrong: () => void;
}

export function Result({ result, onRetry, onHome, onReviewWrong }: ResultProps) {
  const passed = result.score >= EXAM_INFO.passingPercent;
  const msg =
    result.score === 100 ? '満点！完璧です 🎉'
    : result.score >= 90 ? 'すばらしい成績です！'
    : result.score >= EXAM_INFO.passingPercent ? '合格ライン到達！'
    : 'もう少し！弱点を復習しましょう';

  const wrongCount = result.details.filter((d) => !d.correct).length;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-black text-white mb-1">📊 結果</h1>
      <p className="text-ink-3 text-sm mb-6">
        {result.mode === 'exam' ? '本番形式 模擬試験' : '練習'} · {result.total}問中 {result.correct}問正解
      </p>

      {/* Score Card */}
      <div className={`card border-2 text-center mb-6 ${passed ? 'border-moss' : 'border-rose'}`}>
        <div className="text-sm font-bold text-white mb-1">{msg}</div>
        <div className="text-5xl font-black font-mono leading-none my-3" style={{ color: passed ? '#5fc878' : '#f0608a' }}>
          {result.score}%
        </div>
        <div className="text-sm text-ink-3">
          {result.correct} / {result.total} 問正解
          {result.durationSec > 0 && <> · ⏱ {formatTime(result.durationSec)}</>}
        </div>
        <div className="mt-3">
          <span className={`chip ${passed ? 'bg-moss/15 text-moss' : 'bg-rose/15 text-rose'}`}>
            {passed ? `合格ライン(${EXAM_INFO.passingPercent}%)達成` : `合格まであと${EXAM_INFO.passingPercent - result.score}%`}
          </span>
        </div>
      </div>

      {/* Domain Breakdown */}
      {Object.keys(result.domainBreakdown).length > 1 && (
        <>
          <h2 className="text-base font-black text-white mb-3">📂 分野別スコア</h2>
          <div className="space-y-2 mb-6">
            {Object.entries(result.domainBreakdown).map(([dKey, b]) => {
              const dom = DOMAINS[dKey as keyof typeof DOMAINS];
              const pct = b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0;
              return (
                <div key={dKey} className="card py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{dom.icon}</span>
                      <strong className="text-sm text-white">{dom.name}</strong>
                    </div>
                    <span className="font-mono text-sm font-bold" style={{ color: dom.color }}>{pct}%</span>
                  </div>
                  <ProgressBar percent={pct} color={dom.color} height={5} />
                  <div className="text-[0.7rem] text-ink-3 mt-1 font-mono">{b.correct} / {b.total} 問</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Answer Review */}
      <h2 className="text-base font-black text-white mb-3">📝 解答レビュー</h2>
      <div className="space-y-2 mb-6">
        {result.details.map((d, i) => {
          const dom = DOMAINS[d.domain];
          const fullQ = getQuestionById(d.questionId);
          return (
            <details key={d.questionId} className="card group">
              <summary className="flex items-center gap-2 cursor-pointer list-none">
                <span className="font-mono text-xs font-bold" style={{ color: d.correct ? '#5fc878' : '#f0608a' }}>
                  {d.correct ? '✓' : '✗'} Q{i + 1}
                </span>
                <span className="chip" style={{ background: `${dom.color}1a`, color: dom.color }}>{dom.shortName}</span>
                <span className="text-xs text-ink-2 truncate flex-1">{d.question.split('```')[0].slice(0, 40)}…</span>
                <span className="text-ink-3 text-xs group-open:rotate-180 transition-transform">▼</span>
              </summary>
              {fullQ && (
                <div className="mt-3 pt-3 border-t border-line text-sm">
                  <p className="text-ink-2 mb-2 whitespace-pre-line">{d.question.split('```')[0]}</p>
                  <div className="space-y-1 mb-2">
                    {fullQ.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={`px-3 py-1.5 rounded text-xs ${
                          oi === d.correctAnswer ? 'bg-moss/10 text-moss font-bold'
                          : oi === d.userAnswer ? 'bg-rose/10 text-rose line-through'
                          : 'text-ink-3'
                        }`}
                      >
                        {String.fromCharCode(65 + oi)}. {opt}
                        {oi === d.correctAnswer && ' ✓'}
                        {oi === d.userAnswer && oi !== d.correctAnswer && ' (あなたの回答)'}
                        {d.userAnswer === null && oi === d.correctAnswer && ' ← 正解（未回答）'}
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-sky/[0.06] border-l-[3px] border-sky rounded-r text-xs text-ink-2 leading-relaxed">
                    {fullQ.explanation}
                  </div>
                </div>
              )}
            </details>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-between flex-wrap">
        <button className="btn btn-secondary" onClick={onHome}>← ホーム</button>
        <div className="flex gap-2">
          {wrongCount > 0 && (
            <button className="btn btn-secondary" onClick={onReviewWrong}>
              ❌ 間違えた{wrongCount}問を復習
            </button>
          )}
          <button className="btn btn-primary" onClick={onRetry}>🔄 もう一度</button>
        </div>
      </div>
    </div>
  );
}
