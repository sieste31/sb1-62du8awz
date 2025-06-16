/**
 * Modal Types
 * Modal関連コンポーネントの型定義
 */

export interface BaseModalProps {
  /**
   * モーダルの表示状態
   * @default false
   */
  open?: boolean;
  
  /**
   * モーダルを閉じる時の処理
   */
  onClose?: () => void;
  
  /**
   * モーダルのタイトル
   */
  title?: string;
  
  /**
   * 閉じるボタンを表示するか
   * @default true
   */
  showCloseButton?: boolean;
  
  /**
   * オーバーレイクリックで閉じるか
   * @default true
   */
  closeOnOverlayClick?: boolean;
  
  /**
   * ESCキーで閉じるか
   * @default true
   */
  closeOnEscape?: boolean;
  
  /**
   * モーダルのサイズ
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * フォーカストラップを有効にするか
   * @default true
   */
  focusTrap?: boolean;
  
  /**
   * 初期フォーカス要素
   */
  initialFocus?: React.RefObject<HTMLElement>;
  
  /**
   * 復帰フォーカス要素
   */
  restoreFocus?: React.RefObject<HTMLElement>;
  
  /**
   * 追加のクラス名
   */
  className?: string;
  
  /**
   * オーバーレイの追加クラス名
   */
  overlayClassName?: string;
  
  /**
   * 子要素
   */
  children?: React.ReactNode;
}

export interface ConfirmModalProps extends Omit<BaseModalProps, 'children'> {
  /**
   * 確認メッセージ
   */
  message: string;
  
  /**
   * 説明文
   */
  description?: string;
  
  /**
   * 確認ボタンのラベル
   * @default '確認'
   */
  confirmLabel?: string;
  
  /**
   * キャンセルボタンのラベル
   * @default 'キャンセル'
   */
  cancelLabel?: string;
  
  /**
   * 確認ボタンの種類
   * @default 'primary'
   */
  confirmVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  
  /**
   * 危険なアクション（削除など）
   * @default false
   */
  destructive?: boolean;
  
  /**
   * ローディング状態
   * @default false
   */
  loading?: boolean;
  
  /**
   * 確認ボタンがクリックされた時の処理
   */
  onConfirm?: () => void | Promise<void>;
  
  /**
   * キャンセルボタンがクリックされた時の処理
   */
  onCancel?: () => void;
}

export interface FormModalProps extends BaseModalProps {
  /**
   * フォームのsubmitハンドラ
   */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  
  /**
   * 送信ボタンのラベル
   * @default '送信'
   */
  submitLabel?: string;
  
  /**
   * キャンセルボタンのラベル
   * @default 'キャンセル'
   */
  cancelLabel?: string;
  
  /**
   * 送信ボタンの種類
   * @default 'primary'
   */
  submitVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  
  /**
   * 送信ボタンを無効にするか
   * @default false
   */
  submitDisabled?: boolean;
  
  /**
   * ローディング状態
   * @default false
   */
  loading?: boolean;
  
  /**
   * キャンセルボタンがクリックされた時の処理
   */
  onCancel?: () => void;
  
  /**
   * フッターを非表示にするか
   * @default false
   */
  hideFooter?: boolean;
  
  /**
   * カスタムフッター
   */
  footer?: React.ReactNode;
}