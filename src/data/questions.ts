import type { Question } from '../types';
import { QUESTIONS_D1, QUESTIONS_D2 } from './questions-part1';

// ===== Domain 3: データ運用とサポート (22%) — 16問 =====
export const QUESTIONS_D3: Question[] = [
  {
    id: 'd3-001', domain: 'D3', service: 'Athena',
    question: 'S3上のデータに対して、サーバーを用意せず標準SQLでアドホックにクエリしたい。最適なサービスは？',
    options: ['Amazon Redshift', 'Amazon Athena', 'Amazon EMR', 'AWS Glue'],
    answer: 1,
    explanation: 'Amazon Athena はS3上のデータ（CSV/JSON/Parquet等）に標準SQLで直接クエリできるサーバーレスサービス。スキャンしたデータ量に対してのみ課金され、アドホック分析に最適です。',
  },
  {
    id: 'd3-002', domain: 'D3', service: 'Athena',
    question: 'Athena のクエリコストを削減したい。最も効果的な方法は？',
    options: ['クエリ結果をキャッシュしない', 'データをParquetに変換し、パーティション分割し、必要な列のみSELECT', 'すべての列をSELECT *', 'CSVのまま使う'],
    answer: 1,
    explanation: 'Athenaはスキャンしたデータ量で課金されます。列指向のParquet（必要列のみ読む）+ パーティション分割（不要パーティションをスキップ）+ SELECT列の限定により、スキャン量を大幅削減してコストを下げられます。',
  },
  {
    id: 'd3-003', domain: 'D3', service: 'CloudWatch',
    question: 'Glueジョブの失敗を検知して即座に運用チームに通知したい。最適な構成は？',
    options: ['手動でジョブ状態を毎日確認', 'CloudWatch Events/EventBridge でジョブ失敗イベント → SNS通知', 'ログを週次でレビュー', 'Lambdaで1分ごとにポーリング'],
    answer: 1,
    explanation: 'EventBridge（CloudWatch Events）でGlueジョブの状態変化（FAILED）イベントをキャプチャし、SNSトピックに通知することで、失敗を即座にメール/Slackで運用チームに知らせるイベント駆動の監視が実現します。',
  },
  {
    id: 'd3-004', domain: 'D3', service: 'QuickSight',
    question: 'ビジネスユーザー向けにデータのインタラクティブなダッシュボードとレポートを提供したい。最適なサービスは？',
    options: ['Amazon Athena', 'Amazon QuickSight', 'AWS Glue DataBrew', 'Amazon CloudWatch'],
    answer: 1,
    explanation: 'Amazon QuickSight はサーバーレスのBI（ビジネスインテリジェンス）サービス。Athena、Redshift、S3等のデータソースに接続し、インタラクティブなダッシュボードや可視化を作成できます。SPICEエンジンで高速集計します。',
  },
  {
    id: 'd3-005', domain: 'D3', service: 'Redshift',
    question: 'Redshiftで特定のクエリが非常に遅い。実行計画を分析して最適化したい。使うものは？',
    options: ['EXPLAIN コマンドと システムテーブル(STL/SVL)', 'VACUUM のみ', 'COPY コマンド', 'UNLOAD コマンド'],
    answer: 0,
    explanation: 'EXPLAIN でクエリ実行計画を確認し、STL_QUERY、SVL_QUERY_SUMMARY等のシステムテーブルで実際の実行統計（ディスクスピル、ネステッドループ等）を分析します。DISTKEY/SORTKEYの見直しにつなげます。',
  },
  {
    id: 'd3-006', domain: 'D3', service: 'Glue',
    question: 'データパイプラインのデータ品質（NULL率、一意性、値の範囲）を自動検証したい。最適な機能は？',
    options: ['手動でサンプルチェック', 'AWS Glue Data Quality', 'CloudWatch Logs', 'Athena で毎回手動クエリ'],
    answer: 1,
    explanation: 'AWS Glue Data Quality はデータ品質ルール（DQDL）を定義し、ETLパイプライン内でNULL率、一意性、整合性、値の範囲等を自動検証します。品質基準を満たさないデータの検知・隔離が可能です。',
  },
  {
    id: 'd3-007', domain: 'D3', service: 'CloudWatch',
    question: 'データパイプライン全体のメトリクス（処理レコード数、レイテンシ、エラー率）を一元的に監視・可視化したい。使うサービスは？',
    options: ['CloudTrail', 'CloudWatch Dashboards + カスタムメトリクス', 'AWS Config', 'Trusted Advisor'],
    answer: 1,
    explanation: 'CloudWatch でカスタムメトリクスを発行し、Dashboards で処理レコード数・レイテンシ・エラー率等を一元可視化します。アラームと組み合わせて閾値超過時の自動通知も設定できます。',
  },
  {
    id: 'd3-008', domain: 'D3', service: 'Athena',
    question: 'Athena で頻繁に実行する複雑な集計クエリの結果を再利用してパフォーマンスを上げたい。利用する機能は？',
    options: ['毎回フルスキャン', 'CTAS（Create Table As Select）や マテリアライズドビュー的な中間テーブル', 'LIMIT句を付ける', 'クエリを短くする'],
    answer: 1,
    explanation: 'CTAS（CREATE TABLE AS SELECT）で集計結果を新しいテーブル（Parquet）として保存し、以降のクエリで再利用すると、毎回の再計算とスキャンを回避できます。中間テーブルによる段階的な集計も有効です。',
  },
  {
    id: 'd3-009', domain: 'D3', service: 'Step Functions',
    question: 'データパイプラインで一部のステップが失敗した際、自動でリトライし、それでも失敗したらアラートを出したい。実装方法は？',
    options: ['Lambdaで例外を握りつぶす', 'Step Functions の Retry と Catch を設定', 'すべて手動で再実行', 'タイムアウトを無限にする'],
    answer: 1,
    explanation: 'Step Functions の各ステートに Retry（指数バックオフでの自動リトライ）と Catch（エラーキャッチして代替処理やSNS通知へ遷移）を定義することで、堅牢なエラーハンドリングを宣言的に実装できます。',
  },
  {
    id: 'd3-010', domain: 'D3', service: 'Redshift',
    question: 'Redshift で同時実行クエリが多く、重要なETLジョブが遅延する。ワークロードを優先度管理したい。使う機能は？',
    options: ['ノードを1つにする', 'WLM（Workload Management）でキューと優先度を設定', 'すべてのクエリを直列実行', 'VACUUM を無効化'],
    answer: 1,
    explanation: 'Redshift の WLM（Workload Management）はクエリをキューに振り分け、メモリ割当やスロット数、優先度を制御します。Automatic WLM やクエリ優先度設定で、重要なETLと分析クエリのリソースを適切に配分できます。',
  },
  {
    id: 'd3-011', domain: 'D3', service: 'EMR',
    question: 'EMRクラスタのコストを最適化したい。処理が終わったら自動でクラスタを終了させたい。設定は？',
    options: ['クラスタを常時起動', 'Auto-termination（自動終了）または ステップ実行後の自動終了', '手動で毎回終了', 'インスタンスを最大にする'],
    answer: 1,
    explanation: 'EMR の Auto-termination ポリシー（アイドル時間後に自動終了）や、トランジェントクラスタ（ステップ完了後に自動終了）を使うと、処理していない時間のコストを削減できます。バッチ処理に特に有効です。',
  },
  {
    id: 'd3-012', domain: 'D3', service: 'Glue',
    question: 'Glueジョブのコスト最適化で、起動時間が頻繁で短時間のジョブに適した実行方式は？',
    options: ['標準のSpark Glueジョブ', 'Glue Flex 実行 や Python Shell（軽量ジョブ）', 'EMRに移行', 'ワーカー数を最大化'],
    answer: 1,
    explanation: '軽量・短時間の処理には Python Shell ジョブ（1/16 DPU等の小構成）が、コスト重視で開始時刻が柔軟なジョブには Flex 実行（余剰キャパシティ利用で低価格）が適します。常にフルSparkを使うのはコスト過剰です。',
  },
  {
    id: 'd3-013', domain: 'D3', service: 'CloudWatch',
    question: 'Kinesis Data Streams で、コンシューマーの処理が追いつかずデータ滞留が発生していないか監視したい。確認するメトリクスは？',
    options: ['CPUUtilization', 'IteratorAge（GetRecords.IteratorAgeMilliseconds）', 'DiskReadOps', 'NetworkIn'],
    answer: 1,
    explanation: 'IteratorAge はコンシューマーが読んでいるレコードの古さを示します。この値が増加し続ける場合、コンシューマーの処理がデータ生成に追いついていない（滞留）ことを意味し、シャード追加やコンシューマー増強が必要です。',
  },
  {
    id: 'd3-014', domain: 'D3', service: 'Athena',
    question: 'Athena のクエリで複数チームのコストを分離して追跡・制限したい。使う機能は？',
    options: ['1つのワークグループを全員で共有', 'Workgroup（ワークグループ）ごとにコスト追跡とデータスキャン上限を設定', 'IAMユーザーを統合', 'クエリ履歴を削除'],
    answer: 1,
    explanation: 'Athena の Workgroup はチーム/用途ごとにクエリを分離し、データスキャン量の上限（コスト制御）、クエリ結果の出力先、CloudWatchメトリクスでのコスト追跡を設定できます。',
  },
  {
    id: 'd3-015', domain: 'D3', service: 'Redshift',
    question: 'Redshift Serverless と プロビジョンドクラスタを比較したとき、Serverlessが適するケースは？',
    options: ['24時間365日一定の高負荷', '断続的・予測不能なワークロードでキャパシティ管理を避けたい', 'コストを固定したい', 'ノード構成を細かく制御したい'],
    answer: 1,
    explanation: 'Redshift Serverless はRPU（Redshift Processing Unit）が自動スケールし、使った分だけ課金。断続的・予測不能なワークロードやキャパシティ管理を避けたい場合に最適です。常時高負荷ならプロビジョンドが安定・低コスト。',
  },
  {
    id: 'd3-016', domain: 'D3', service: 'Glue',
    question: 'Glueジョブを Git で管理し、開発→テスト→本番へCI/CDで自動デプロイしたい。推奨されるアプローチは？',
    options: ['コンソールで手動コピー', 'CloudFormation/CDK + CodePipeline でIaC管理しデプロイ自動化', '本番で直接編集', 'ジョブを1つに統合'],
    answer: 1,
    explanation: 'Glueジョブやワークフローを CloudFormation/CDK でコード化（IaC）し、CodePipeline/CodeBuild でCI/CDパイプラインを構築することで、環境間の一貫したデプロイとバージョン管理、自動テストが実現します。',
  },
];

// ===== Domain 4: データセキュリティとガバナンス (18%) — 14問 =====
export const QUESTIONS_D4: Question[] = [
  {
    id: 'd4-001', domain: 'D4', service: 'KMS',
    question: 'S3データレイクの保存データを暗号化し、暗号鍵の使用をCloudTrailで監査したい。最適な暗号化方式は？',
    options: ['SSE-S3', 'SSE-KMS（カスタマーマネージドキー）', '暗号化しない', 'クライアント側で独自実装'],
    answer: 1,
    explanation: 'SSE-KMS（特にカスタマーマネージドキー）は、KMSで鍵を管理し、鍵の使用がすべてCloudTrailに記録されます。きめ細かいアクセス制御（キーポリシー）と監査が可能で、コンプライアンス要件に対応します。',
  },
  {
    id: 'd4-002', domain: 'D4', service: 'Lake Formation',
    question: 'データアナリストには売上テーブルの「金額」列を見せず、それ以外の列だけアクセスを許可したい。最適な方法は？',
    options: ['テーブル全体へのアクセスを許可', 'Lake Formation の列レベルアクセス制御', 'S3バケットを分ける', 'IAMでバケット全体をDeny'],
    answer: 1,
    explanation: 'AWS Lake Formation は列レベル・行レベル・セルレベルのきめ細かいアクセス制御を提供します。特定の列（金額等）を除外してアクセス許可することで、データ最小化の原則を実現できます。',
  },
  {
    id: 'd4-003', domain: 'D4', service: 'Macie',
    question: 'S3バケット内に個人情報（PII）が誤って保存されていないか自動的に検出したい。最適なサービスは？',
    options: ['Amazon Inspector', 'Amazon Macie', 'AWS Config', 'Amazon GuardDuty'],
    answer: 1,
    explanation: 'Amazon Macie は機械学習を使ってS3内の機密データ（氏名、クレジットカード番号、パスポート番号等のPII）を自動検出・分類します。データプライバシーとコンプライアンス管理に使います。',
  },
  {
    id: 'd4-004', domain: 'D4', service: 'IAM',
    question: 'Glueジョブが特定のS3バケットとDynamoDBテーブルにのみアクセスできるようにしたい。最小権限の原則に従う方法は？',
    options: ['AdministratorAccess を付与', '必要なリソースとアクションのみを許可するIAMロールをGlueにアタッチ', 'すべてのS3へのアクセスを許可', 'アクセスキーをジョブにハードコード'],
    answer: 1,
    explanation: '最小権限の原則に従い、Glueジョブ用のIAMロールに、必要なS3バケット（特定ARN）とDynamoDBテーブルへの必要なアクション（GetObject、PutItem等）のみを許可します。ワイルドカードの多用やアクセスキーのハードコードは避けます。',
  },
  {
    id: 'd4-005', domain: 'D4', service: 'KMS',
    question: 'Redshiftクラスタとそのスナップショット、S3への UNLOAD データすべてを暗号化したい。一貫した鍵管理の方法は？',
    options: ['それぞれ別の方式で暗号化', 'KMS キーで統一的に暗号化（Redshift暗号化 + S3 SSE-KMS）', '暗号化しない', 'パスワードで保護'],
    answer: 1,
    explanation: 'KMSキーを使ってRedshiftクラスタの暗号化を有効化すると、データ・スナップショットが暗号化されます。UNLOAD先のS3も同じくSSE-KMSで暗号化することで、一貫した鍵管理と監査が実現します。',
  },
  {
    id: 'd4-006', domain: 'D4', service: 'CloudTrail',
    question: 'データレイクへのすべてのAPIアクセス（誰がいつどのデータにアクセスしたか）を監査記録したい。使うサービスは？',
    options: ['CloudWatch メトリクス', 'AWS CloudTrail（+ S3データイベント）', 'AWS Config', 'VPC Flow Logs'],
    answer: 1,
    explanation: 'AWS CloudTrail はAPIコールを記録します。S3データイベントを有効化すると、オブジェクトレベルのアクセス（GetObject/PutObject）も記録され、「誰がいつどのデータにアクセスしたか」の監査証跡が残ります。',
  },
  {
    id: 'd4-007', domain: 'D4', service: 'IAM',
    question: '別のAWSアカウントのGlueジョブから、自社アカウントのS3バケットへ安全にアクセスを許可したい。最適な方法は？',
    options: ['バケットをパブリックにする', 'クロスアカウントIAMロール（AssumeRole）とバケットポリシー', 'アクセスキーを共有', 'すべてのアカウントに許可'],
    answer: 1,
    explanation: 'クロスアカウントアクセスは、信頼関係を設定したIAMロールをAssumeRoleで引き受け、バケットポリシーで対象ロール/アカウントを許可します。一時的な認証情報を使い、アクセスキー共有のリスクを回避します。',
  },
  {
    id: 'd4-008', domain: 'D4', service: 'KMS',
    question: 'Kinesis Data Streams を流れるデータを転送中・保存中ともに暗号化したい。設定は？',
    options: ['暗号化は不要', 'サーバー側暗号化（KMS）を有効化し、HTTPS（TLS）で送信', 'クライアントでBase64エンコード', 'データを圧縮する'],
    answer: 1,
    explanation: 'Kinesis のサーバー側暗号化（KMS）で保存データを暗号化し、データ送信はHTTPS（TLS）で転送中を暗号化します。これにより取込パイプライン全体でデータが保護されます。',
  },
  {
    id: 'd4-009', domain: 'D4', service: 'Lake Formation',
    question: 'データガバナンスで、データの利用許可を一元管理し、Athena/Redshift Spectrum/EMRすべてに同じポリシーを適用したい。使うサービスは？',
    options: ['各サービスで個別にIAM設定', 'Lake Formation の集中アクセス許可', 'S3バケットポリシーのみ', 'セキュリティグループ'],
    answer: 1,
    explanation: 'Lake Formation はデータレイクのアクセス許可を一元管理し、Glue Data Catalog経由でAthena、Redshift Spectrum、EMR、Glueすべてに統一されたポリシーを適用します。サービスごとの個別設定が不要になります。',
  },
  {
    id: 'd4-010', domain: 'D4', service: 'Secrets Manager',
    question: 'ETLジョブが使うデータベースの認証情報を安全に管理し、定期的に自動ローテーションしたい。最適なサービスは？',
    options: ['環境変数に平文で設定', 'AWS Secrets Manager', 'コードにハードコード', 'S3にテキストファイルで保存'],
    answer: 1,
    explanation: 'AWS Secrets Manager はDB認証情報やAPIキーを暗号化して保存し、自動ローテーション（RDS等と統合）が可能です。Glueジョブやアプリは実行時にAPIで取得でき、認証情報のハードコードを避けられます。',
  },
  {
    id: 'd4-011', domain: 'D4', service: 'Glue',
    question: 'Glueで処理するデータ内の個人情報（PII）を、変換時に検出してマスキング/トークン化したい。利用する機能は？',
    options: ['手動で目視確認', 'Glue の PII検出・マスキング変換（Detect PII transform）', 'すべて削除', '暗号化のみ'],
    answer: 1,
    explanation: 'AWS Glue Studio の Detect Sensitive Data（PII検出）変換は、ETL処理中にPII（メール、SSN、クレジットカード等）を検出し、マスキング・置換・パーティション分離などの処理を適用できます。',
  },
  {
    id: 'd4-012', domain: 'D4', service: 'VPC',
    question: 'データパイプラインのコンポーネントをインターネットに公開せず、VPC内でプライベートに通信させたい。S3/DynamoDBへのアクセス方法は？',
    options: ['NAT Gateway経由のみ', 'VPCエンドポイント（S3/DynamoDBはゲートウェイ型）', 'インターネットゲートウェイ', 'パブリックIPを付与'],
    answer: 1,
    explanation: 'VPCエンドポイントを使うと、VPC内のリソースがインターネットを経由せずにAWSサービスへプライベートにアクセスできます。S3とDynamoDBはゲートウェイ型エンドポイント（無料）、その他のサービスはインターフェース型（PrivateLink）を使います。',
  },
  {
    id: 'd4-013', domain: 'D4', service: 'Redshift',
    question: 'Redshift で、特定のユーザーには集計済みのビューのみアクセスを許可し、生テーブルは見せたくない。実装方法は？',
    options: ['全テーブルへのSELECT権限を付与', 'ビューを作成しビューにのみGRANT、基テーブルへの直接権限は付与しない', 'すべてのユーザーをスーパーユーザーに', 'テーブルを暗号化'],
    answer: 1,
    explanation: 'Redshift でビュー（または マテリアライズドビュー）を作成し、ユーザーにはビューへのSELECT権限のみGRANTします。基テーブルへの直接アクセス権限を与えないことで、ビュー経由の制限されたアクセスを実現します。',
  },
  {
    id: 'd4-014', domain: 'D4', service: 'IAM',
    question: 'タグベースでデータリソースへのアクセスを制御したい（例: 部署タグが一致する場合のみ許可）。使う仕組みは？',
    options: ['リソースごとに個別ポリシー', 'IAM の ABAC（属性ベースアクセス制御）+ タグ条件', 'すべて許可', 'ランダムなアクセスキー'],
    answer: 1,
    explanation: 'ABAC（Attribute-Based Access Control）はリソースとプリンシパルのタグを使ってアクセスを制御します。IAMポリシーの条件（aws:ResourceTag等）で「部署タグが一致する場合のみ許可」のような動的で拡張性の高い制御が可能です。',
  },
];

// ===== 全問題を統合 =====
export const ALL_QUESTIONS: Question[] = [
  ...QUESTIONS_D1,
  ...QUESTIONS_D2,
  ...QUESTIONS_D3,
  ...QUESTIONS_D4,
];

export function getQuestionsByDomain(domain: string): Question[] {
  return ALL_QUESTIONS.filter((q) => q.domain === domain);
}

export function getQuestionById(id: string): Question | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}
