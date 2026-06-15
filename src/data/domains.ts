import type { Domain, DomainKey } from '../types';

export const DOMAINS: Record<DomainKey, Domain> = {
  D1: {
    key: 'D1',
    name: 'データの取り込みと変換',
    shortName: '取込・変換',
    weight: 34,
    icon: '🔄',
    color: '#ff9900',
    description: 'データパイプラインの構築、ETL/ELT処理、ストリーミング取込、オーケストレーション',
    topics: [
      'Kinesis Data Streams / Firehose による取込',
      'AWS Glue による ETL ジョブ',
      'Amazon EMR / Spark による大規模変換',
      'Lambda によるイベント駆動処理',
      'Step Functions / MWAA によるオーケストレーション',
      'バッチ vs ストリーミングの選定',
    ],
  },
  D2: {
    key: 'D2',
    name: 'データストアの管理',
    shortName: 'ストア管理',
    weight: 26,
    icon: '🗄️',
    color: '#4a9eff',
    description: 'データストアの選定、スキーマ設計、データカタログ、ライフサイクル管理',
    topics: [
      'S3 ストレージクラスとライフサイクル',
      'Redshift によるデータウェアハウス',
      'DynamoDB の設計とパフォーマンス',
      'Glue Data Catalog / Lake Formation',
      'データレイク設計（Parquet, パーティショニング）',
      'RDS / Aurora の選定',
    ],
  },
  D3: {
    key: 'D3',
    name: 'データ運用とサポート',
    shortName: '運用・サポート',
    weight: 22,
    icon: '⚙️',
    color: '#1ec8b0',
    description: 'パイプラインの自動化、監視、トラブルシューティング、パフォーマンス最適化',
    topics: [
      'CloudWatch による監視とアラート',
      'Athena によるアドホック分析',
      'QuickSight による可視化',
      'パイプラインのCI/CD',
      'コスト最適化とパフォーマンスチューニング',
      'データ品質の検証',
    ],
  },
  D4: {
    key: 'D4',
    name: 'データセキュリティとガバナンス',
    shortName: 'セキュリティ',
    weight: 18,
    icon: '🔒',
    color: '#a472f0',
    description: '認証・認可、暗号化、データプライバシー、監査、コンプライアンス',
    topics: [
      'IAM によるアクセス制御',
      'KMS による暗号化（保存時・転送時）',
      'Lake Formation による細粒度アクセス制御',
      'Macie による機密データ検出',
      'CloudTrail による監査',
      'データマスキングとプライバシー保護',
    ],
  },
};

export const DOMAIN_ORDER: DomainKey[] = ['D1', 'D2', 'D3', 'D4'];

// 試験基本情報
export const EXAM_INFO = {
  code: 'DEA-C01',
  name: 'AWS Certified Data Engineer - Associate',
  duration: 130, // 分
  questionCount: 65,
  passingScore: 720, // /1000
  passingPercent: 72, // 合格目安%
  fee: '$150 USD',
};
