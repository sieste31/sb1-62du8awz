/**
 * Layout Types
 * Layout関連コンポーネントの型定義
 */

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * コンテナの最大幅
   * @default 'lg'
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'fluid';
  
  /**
   * パディング
   * @default 'md'
   */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * 追加のクラス名
   */
  className?: string;
  
  /**
   * 子要素
   */
  children?: React.ReactNode;
}

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * スタックの方向
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal';
  
  /**
   * 要素間のスペース
   * @default 'md'
   */
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * 交差軸での配置
   * @default 'stretch'
   */
  align?: 'start' | 'center' | 'end' | 'stretch';
  
  /**
   * 主軸での配置
   * @default 'start'
   */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  
  /**
   * ラップするかどうか
   * @default false
   */
  wrap?: boolean;
  
  /**
   * 追加のクラス名
   */
  className?: string;
  
  /**
   * 子要素
   */
  children?: React.ReactNode;
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * グリッドのカラム数
   * @default 1
   */
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  
  /**
   * 要素間のギャップ
   * @default 'md'
   */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * レスポンシブなカラム設定
   */
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 6 | 12;
  };
  
  /**
   * 追加のクラス名
   */
  className?: string;
  
  /**
   * 子要素
   */
  children?: React.ReactNode;
}