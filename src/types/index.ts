// ===== ドメイン定義 =====
export type DomainKey = 'D1' | 'D2' | 'D3' | 'D4';

export interface Domain {
  key: DomainKey;
  name: string;
  shortName: string;
  weight: number; // 試験での配点比率(%)
  icon: string;
  color: string;
  description: string;
  topics: string[];
}

// ===== 問題 =====
export interface Question {
  id: string;
  domain: DomainKey;
  question: string;
  options: string[];
  answer: number; // 正解のインデックス
  explanation: string;
  /** 複数選択問題の場合の追加正解（将来拡張用） */
  service?: string; // 関連AWSサービス（タグ表示用）
}

// ===== 学習進捗 =====
export interface AnswerRecord {
  correct: number;
  wrong: number;
  lastAnswered: number; // timestamp
}

export interface SessionRecord {
  date: number;
  mode: QuizMode;
  domain: DomainKey | 'all';
  correct: number;
  total: number;
  score: number;
  durationSec: number;
}

export interface Progress {
  history: SessionRecord[];
  answered: Record<string, AnswerRecord>; // questionId -> record
  bookmarks: string[]; // ブックマークした問題ID
}

// ===== クイズ設定 =====
export type QuizMode = 'practice' | 'exam' | 'review' | 'bookmark';

export interface QuizConfig {
  mode: QuizMode;
  domain: DomainKey | 'all';
  questions: Question[];
  timed: boolean;
  timeLimitSec?: number;
}

export interface QuizResultDetail {
  questionId: string;
  question: string;
  domain: DomainKey;
  userAnswer: number | null;
  correctAnswer: number;
  correct: boolean;
}

export interface QuizResult {
  mode: QuizMode;
  domain: DomainKey | 'all';
  correct: number;
  total: number;
  score: number;
  durationSec: number;
  details: QuizResultDetail[];
  domainBreakdown: Record<string, { correct: number; total: number }>;
}

export type Page = 'home' | 'quiz' | 'result' | 'stats' | 'study';
