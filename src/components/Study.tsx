import { useState } from 'react';
import { DOMAINS, DOMAIN_ORDER, EXAM_INFO } from '../data/domains';
import type { DomainKey } from '../types';

// サービスチートシート（分野別の頻出サービス早見表）
const SERVICE_CHEATSHEET: Record<DomainKey, Array<{ svc: string; use: string }>> = {
  D1: [
    { svc: 'Kinesis Data Streams', use: 'リアルタイムストリーミング取込。複数コンシューマー、ストリーム再生可' },
    { svc: 'Kinesis Data Firehose', use: 'S3/Redshift等へのフルマネージド配信。バッファ・形式変換(Parquet)' },
    { svc: 'AWS Glue', use: 'サーバーレスETL。Crawler(スキーマ検出)+Job(Spark)。Job Bookmarksで増分処理' },
    { svc: 'Amazon EMR', use: 'Spark/Hadoop大規模処理。タスクノードにスポットでコスト削減' },
    { svc: 'AWS Lambda', use: 'イベント駆動の軽量処理。S3イベント連携。15分制限' },
    { svc: 'Step Functions', use: 'ワークフロー編成。Retry/Catch、waitForTaskToken' },
    { svc: 'Amazon MWAA', use: 'マネージドAirflow。既存DAG移行に最適' },
    { svc: 'AWS DMS', use: 'DB移行。CDCで継続同期し最小ダウンタイム' },
    { svc: 'Glue DataBrew', use: 'ノーコードのデータ準備。250+変換をGUIで' },
  ],
  D2: [
    { svc: 'Amazon S3', use: 'データレイク基盤。Intelligent-Tiering/ライフサイクルでコスト最適化' },
    { svc: 'Amazon Redshift', use: '列指向DWH。DISTKEY/SORTKEY最適化、RA3+Spectrum、WLM' },
    { svc: 'Amazon DynamoDB', use: 'NoSQL。パーティションキー設計、GSI、オンデマンド/プロビジョンド' },
    { svc: 'Glue Data Catalog', use: '中央メタデータ。Athena/Redshift Spectrum/EMRで共有' },
    { svc: 'Amazon Aurora', use: 'OLTP向けRDB。MySQL/PostgreSQL互換、高可用' },
    { svc: 'OpenSearch', use: 'ログ分析・全文検索・リアルタイムダッシュボード' },
    { svc: 'S3 Object Lock', use: 'WORM。コンプラ要件の改ざん防止・長期保管' },
  ],
  D3: [
    { svc: 'Amazon Athena', use: 'S3にSQLで直接クエリ。スキャン量課金、Workgroupでコスト管理' },
    { svc: 'Amazon QuickSight', use: 'サーバーレスBI。SPICEで高速、ダッシュボード作成' },
    { svc: 'CloudWatch', use: 'メトリクス監視・アラート・ダッシュボード。IteratorAgeで滞留検知' },
    { svc: 'EventBridge', use: 'イベント駆動。ジョブ失敗→SNS通知、定期実行(Scheduler)' },
    { svc: 'Glue Data Quality', use: 'データ品質ルール(DQDL)で自動検証' },
    { svc: 'Redshift WLM', use: 'クエリのキュー・優先度管理。重要ETLを優先' },
  ],
  D4: [
    { svc: 'AWS KMS', use: '暗号鍵管理。SSE-KMSでCloudTrail監査、細粒度制御' },
    { svc: 'Lake Formation', use: '列/行/セルレベルアクセス制御。一元的なデータ許可' },
    { svc: 'Amazon Macie', use: 'S3内のPII(個人情報)を機械学習で自動検出' },
    { svc: 'AWS IAM', use: '最小権限のロール。ABAC(タグベース)、AssumeRole(クロスアカウント)' },
    { svc: 'CloudTrail', use: 'APIコール監査。S3データイベントでオブジェクトアクセス記録' },
    { svc: 'Secrets Manager', use: 'DB認証情報の暗号化保存と自動ローテーション' },
    { svc: 'VPCエンドポイント', use: 'インターネット経由せずAWSサービスへプライベート接続' },
  ],
};

export function Study() {
  const [activeDomain, setActiveDomain] = useState<DomainKey>('D1');
  const dom = DOMAINS[activeDomain];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-black text-white mb-1">📖 学習リファレンス</h1>
      <p className="text-ink-3 text-sm mb-6">
        {EXAM_INFO.code} 4分野の重要サービスと要点。問題を解く前の知識整理に。
      </p>

      {/* 試験概要 */}
      <div className="card mb-6">
        <h3 className="font-bold text-white mb-3">📋 試験概要</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div>
            <div className="font-mono text-lg font-black text-aws">{EXAM_INFO.questionCount}問</div>
            <div className="text-[0.65rem] text-ink-3">問題数</div>
          </div>
          <div>
            <div className="font-mono text-lg font-black text-sky">{EXAM_INFO.duration}分</div>
            <div className="text-[0.65rem] text-ink-3">試験時間</div>
          </div>
          <div>
            <div className="font-mono text-lg font-black text-moss">{EXAM_INFO.passingScore}</div>
            <div className="text-[0.65rem] text-ink-3">合格点/1000</div>
          </div>
          <div>
            <div className="font-mono text-lg font-black text-violet">{EXAM_INFO.fee}</div>
            <div className="text-[0.65rem] text-ink-3">受験料</div>
          </div>
        </div>
      </div>

      {/* ドメインタブ */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {DOMAIN_ORDER.map((key) => {
          const d = DOMAINS[key];
          return (
            <button
              key={key}
              onClick={() => setActiveDomain(key)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                activeDomain === key ? 'text-paper' : 'text-ink-3 border-line hover:text-white'
              }`}
              style={activeDomain === key ? { background: d.color, borderColor: d.color } : {}}
            >
              {d.icon} {d.shortName} ({d.weight}%)
            </button>
          );
        })}
      </div>

      {/* ドメイン詳細 */}
      <div className="card mb-4" style={{ borderColor: `${dom.color}40` }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{dom.icon}</span>
          <div>
            <h2 className="font-black text-white">{dom.name}</h2>
            <span className="chip font-mono" style={{ background: `${dom.color}1a`, color: dom.color }}>
              配点 {dom.weight}%
            </span>
          </div>
        </div>
        <p className="text-sm text-ink-2 mb-3">{dom.description}</p>
        <h4 className="text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">学習トピック</h4>
        <ul className="space-y-1">
          {dom.topics.map((t, i) => (
            <li key={i} className="text-sm text-ink-2 flex items-start gap-2">
              <span style={{ color: dom.color }}>▸</span> {t}
            </li>
          ))}
        </ul>
      </div>

      {/* サービスチートシート */}
      <h3 className="text-base font-black text-white mb-3">🔑 頻出サービス早見表</h3>
      <div className="space-y-2">
        {SERVICE_CHEATSHEET[activeDomain].map((item) => (
          <div key={item.svc} className="card py-3">
            <div className="flex items-start gap-3">
              <span className="chip font-mono flex-shrink-0 mt-0.5" style={{ background: `${dom.color}1a`, color: dom.color }}>
                {item.svc}
              </span>
              <span className="text-sm text-ink-2 leading-relaxed">{item.use}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
