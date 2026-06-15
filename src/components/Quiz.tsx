import { useState, useMemo } from 'react';
import type { QuizConfig, QuizResult, QuizResultDetail } from '../types';
import { DOMAINS, EXAM_INFO } from '../data/domains';
import { useTimer, formatTime } from '../hooks/useTimer';
import { DomainChip, ServiceTag, ProgressBar } from './ui';

interface QuizProps {
  config: QuizConfig;
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  onFinish: (result: QuizResult) => void;
  onCancel: () => void;
}

export function Quiz({ config, bookmarks, onToggleBookmark, onFinish, onCancel }: QuizProps) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showExp, setShowExp] = useState(false);
  const { elapsedSec } = useTimer(true);

  const isExam = config.mode === 'exam';
  const q = config.questions[idx];
  const isAnswered = answers[idx] !== undefined;
  const isCorrect = answers[idx] === q.answer;
  const dom = DOMAINS[q.domain];
  const isBookmarked = bookmarks.includes(q.id);

  // 試験モードでは解説を即表示しない
  const revealExplanation = !isExam && showExp;

  const selectAnswer = (a: number) => {
    if (isAnswered) return;
    setAnswers({ ...answers, [idx]: a });
    if (!isExam) setShowExp(true);
  };

  const goTo = (newIdx: number) => {
    setIdx(newIdx);
    setShowExp(answers[newIdx] !== undefined && !isExam);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finish = () => {
    const details: QuizResultDetail[] = config.questions.map((qq, i) => ({
      questionId: qq.id,
      question: qq.question,
      domain: qq.domain,
      userAnswer: answers[i] ?? null,
      correctAnswer: qq.answer,
      correct: answers[i] === qq.answer,
    }));
    const correct = details.filter((d) => d.correct).length;
    const domainBreakdown: Record<string, { correct: number; total: number }> = {};
    details.forEach((d) => {
      if (!domainBreakdown[d.domain]) domainBreakdown[d.domain] = { correct: 0, total: 0 };
      domainBreakdown[d.domain].total += 1;
      if (d.correct) domainBreakdown[d.domain].correct += 1;
    });
    onFinish({
      mode: config.mode,
      domain: config.domain,
      correct,
      total: config.questions.length,
      score: Math.round((correct / config.questions.length) * 100),
      durationSec: elapsedSec,
      details,
      domainBreakdown,
    });
  };

  const answeredCount = Object.keys(answers).length;
  const progressPct = ((idx + 1) / config.questions.length) * 100;
  const isLast = idx === config.questions.length - 1;

  // 試験モード用：制限時間オーバー判定
  const timeLimit = isExam ? EXAM_INFO.duration * 60 : 0;
  const timeRemaining = timeLimit - elapsedSec;
  const timeWarning = isExam && timeRemaining < 300; // 残り5分

  const renderQuestion = useMemo(() => {
    // 問題文中の擬似コードブロック（```で囲まれた部分）をレンダリング
    const parts = q.question.split('```');
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <pre key={i} className="codeblock">{part.trim()}</pre>
      ) : (
        <span key={i} className="whitespace-pre-line">{part}</span>
      )
    );
  }, [q.question]);

  return (
    <div className="animate-fade-in">
      {/* Quiz Header */}
      <div className="card flex items-center gap-3 mb-4 flex-wrap">
        <div className="text-sm text-ink-3">
          問 <strong className="text-white font-mono">{idx + 1}</strong>
          <span className="text-ink-3"> / {config.questions.length}</span>
        </div>
        <div className="flex-1 min-w-[120px]">
          <ProgressBar percent={progressPct} color="#ff9900" height={6} />
        </div>
        {isExam && (
          <div className={`font-mono text-sm font-bold ${timeWarning ? 'text-rose animate-pulse' : 'text-teal'}`}>
            ⏱ {formatTime(Math.max(0, timeRemaining))}
          </div>
        )}
        <button className="btn btn-ghost text-xs px-3 py-1.5" onClick={onCancel}>
          中断
        </button>
      </div>

      {/* Question Card */}
      <div className={`card border-2 mb-4 ${
        isAnswered && !isExam ? (isCorrect ? 'border-moss' : 'border-rose') : 'border-line'
      }`}>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="font-mono text-xs font-bold text-aws">Q{String(idx + 1).padStart(2, '0')}</span>
          <DomainChip name={dom.shortName} color={dom.color} icon={dom.icon} />
          <ServiceTag service={q.service} />
          <button
            className={`ml-auto text-lg transition-transform hover:scale-110 ${isBookmarked ? '' : 'opacity-40'}`}
            onClick={() => onToggleBookmark(q.id)}
            title="ブックマーク"
          >
            {isBookmarked ? '⭐' : '☆'}
          </button>
        </div>

        <div className="text-[0.95rem] font-bold text-white mb-4 leading-relaxed">
          {renderQuestion}
        </div>

        <div className="flex flex-col gap-2">
          {q.options.map((opt, i) => {
            let cls = 'w-full text-left px-4 py-3 rounded-lg border text-sm leading-relaxed transition-all ';
            if (isAnswered) {
              cls += 'pointer-events-none ';
              if (!isExam) {
                if (i === q.answer) cls += 'bg-moss/10 border-moss text-moss font-bold ';
                else if (i === answers[idx]) cls += 'bg-rose/10 border-rose text-rose line-through opacity-60 ';
                else cls += 'bg-paper border-line text-ink-3 ';
              } else {
                // 試験モード：選択したものだけハイライト
                if (i === answers[idx]) cls += 'bg-aws/10 border-aws text-aws font-bold ';
                else cls += 'bg-paper border-line text-ink-2 ';
              }
            } else {
              cls += 'bg-paper border-line text-ink-2 hover:border-line-2 hover:bg-paper-3 hover:text-white ';
            }
            return (
              <button key={i} className={cls} onClick={() => selectAnswer(i)}>
                <span className="font-mono font-bold mr-1">{String.fromCharCode(65 + i)}.</span> {opt}
              </button>
            );
          })}
        </div>

        {revealExplanation && (
          <div className="mt-4 p-4 bg-sky/[0.06] border-l-[3px] border-sky rounded-r-lg animate-fade-in">
            <div className="font-bold mb-1" style={{ color: isCorrect ? '#5fc878' : '#f0608a' }}>
              {isCorrect ? '✅ 正解！' : '❌ 不正解'}
            </div>
            <p className="text-sm text-ink-2 leading-relaxed">{q.explanation}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 justify-between items-center">
        <button className="btn btn-secondary" onClick={() => goTo(idx - 1)} disabled={idx === 0}>
          ← 前へ
        </button>

        {isExam && (
          <div className="text-xs text-ink-3 font-mono">
            回答済 {answeredCount}/{config.questions.length}
          </div>
        )}

        {isLast ? (
          <button
            className="btn btn-primary"
            onClick={finish}
            disabled={isExam ? false : !isAnswered}
          >
            {isExam ? '採点する →' : '結果を見る →'}
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => goTo(idx + 1)}
            disabled={isExam ? false : !isAnswered}
          >
            次へ →
          </button>
        )}
      </div>
    </div>
  );
}
