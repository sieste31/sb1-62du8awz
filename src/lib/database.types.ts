/**
 * database.types.ts
 * 
 * このファイルはSupabaseデータベースの型定義を提供します。
 * アプリケーション全体でデータベースとのやり取りに使用される型安全な
 * インターフェースを定義しています。
 */

/**
 * JSON値の型定義
 * Supabaseの JSON/JSONB 型のデータを表現するための型です。
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * データベース全体の型定義
 * アプリケーションで使用するすべてのテーブル、ビュー、関数の型情報を含みます。
 */
export interface Database {
  /**
   * publicスキーマ
   * アプリケーションのメインデータを格納するスキーマです。
   */
  public: {
    /**
     * データベーステーブル定義
     */
    Tables: {
      /**
       * battery_groups テーブル
       * 電池グループ（同じ種類の電池の集まり）の情報を管理します。
       */
      battery_groups: {
        /**
         * テーブルから取得される行の型定義
         */
        Row: {
          id: string                           // 電池グループの一意識別子
          name: string                         // 電池グループの名前
          type: string                         // 電池の種類（例: AA, AAA, 18650など）
          kind: 'disposable' | 'rechargeable'  // 電池の種別（使い捨てか充電式か）
          count: number                        // グループ内の電池数
          voltage: number                      // 電池の電圧
          notes: string | null                 // 追加メモ（オプション）
          image_url: string | null             // 電池画像のURL（オプション）
          created_at: string                   // 作成日時
          user_id: string                      // 所有ユーザーのID
        }
        /**
         * テーブルに新規レコードを挿入する際の型定義
         */
        Insert: {
          id?: string                          // 自動生成可能なID
          name: string                         // 必須: 電池グループ名
          type: string                         // 必須: 電池タイプ
          kind: 'disposable' | 'rechargeable'  // 必須: 電池種別
          count: number                        // 必須: 電池数
          voltage: number                      // 必須: 電圧
          notes?: string | null                // オプション: メモ
          image_url?: string | null            // オプション: 画像URL
          created_at?: string                  // オプション: 作成日時（デフォルト値あり）
          user_id: string                      // 必須: ユーザーID
        }
        /**
         * テーブルの既存レコードを更新する際の型定義
         * すべてのフィールドがオプショナルになっています
         */
        Update: {
          id?: string                          // 更新対象のID
          name?: string                        // 電池グループ名
          type?: string                        // 電池タイプ
          kind?: 'disposable' | 'rechargeable' // 電池種別
          count?: number                       // 電池数
          voltage?: number                     // 電圧
          notes?: string | null                // メモ
          image_url?: string | null            // 画像URL
          created_at?: string                  // 作成日時
          user_id?: string                     // ユーザーID
        }
      }
      /**
       * batteries テーブル
       * 個々の電池の状態と使用状況を管理します。
       */
      batteries: {
        /**
         * テーブルから取得される行の型定義
         */
        Row: {
          id: string                                               // 電池の一意識別子
          group_id: string                                         // 所属する電池グループのID
          slot_number: number                                      // グループ内のスロット番号
          status: 'charged' | 'in_use' | 'empty' | 'disposed'      // 電池の状態
          last_checked: string | null                              // 最後に確認した日時
          last_changed_at: string | null                           // 最後に状態が変更された日時
          device_id: string | null                                 // 現在使用中のデバイスID（ある場合）
          created_at: string                                       // 作成日時
          user_id: string                                          // 所有ユーザーのID
        }
        /**
         * テーブルに新規レコードを挿入する際の型定義
         */
        Insert: {
          id?: string                                              // 自動生成可能なID
          group_id: string                                         // 必須: 電池グループID
          slot_number?: number                                     // オプション: スロット番号（自動割り当て可能）
          status: 'charged' | 'in_use' | 'empty' | 'disposed'      // 必須: 電池状態
          last_checked?: string | null                             // オプション: 最終確認日時
          last_changed_at?: string | null                          // オプション: 最終状態変更日時
          device_id?: string | null                                // オプション: 使用中デバイスID
          created_at?: string                                      // オプション: 作成日時（デフォルト値あり）
          user_id: string                                          // 必須: ユーザーID
        }
        /**
         * テーブルの既存レコードを更新する際の型定義
         */
        Update: {
          id?: string                                              // 更新対象のID
          group_id?: string                                        // 電池グループID
          slot_number?: number                                     // スロット番号
          status?: 'charged' | 'in_use' | 'empty' | 'disposed'     // 電池状態
          last_checked?: string | null                             // 最終確認日時
          last_changed_at?: string | null                          // 最終状態変更日時
          device_id?: string | null                                // 使用中デバイスID
          created_at?: string                                      // 作成日時
          user_id?: string                                         // ユーザーID
        }
      }
      /**
       * battery_usage_history テーブル
       * 電池の使用履歴を記録します。デバイスでの使用開始から終了までを追跡します。
       */
      battery_usage_history: {
        /**
         * テーブルから取得される行の型定義
         */
        Row: {
          id: string                // 履歴エントリーの一意識別子
          battery_id: string        // 使用された電池のID
          device_id: string         // 使用されたデバイスのID
          started_at: string        // 使用開始日時
          ended_at: string | null   // 使用終了日時（現在使用中の場合はnull）
          created_at: string        // 記録作成日時
          user_id: string           // 所有ユーザーのID
        }
        /**
         * テーブルに新規レコードを挿入する際の型定義
         */
        Insert: {
          id?: string               // 自動生成可能なID
          battery_id: string        // 必須: 電池ID
          device_id: string         // 必須: デバイスID
          started_at: string        // 必須: 使用開始日時
          ended_at?: string | null  // オプション: 使用終了日時
          created_at?: string       // オプション: 作成日時（デフォルト値あり）
          user_id: string           // 必須: ユーザーID
        }
        /**
         * テーブルの既存レコードを更新する際の型定義
         */
        Update: {
          id?: string               // 更新対象のID
          battery_id?: string       // 電池ID
          device_id?: string        // デバイスID
          started_at?: string       // 使用開始日時
          ended_at?: string | null  // 使用終了日時
          created_at?: string       // 作成日時
          user_id?: string          // ユーザーID
        }
      }
      /**
       * devices テーブル
       * 電池を使用するデバイスの情報を管理します。
       */
      devices: {
        /**
         * テーブルから取得される行の型定義
         */
        Row: {
          id: string                                                           // デバイスの一意識別子
          name: string                                                         // デバイス名
          type: 'smartphone' | 'speaker' | 'camera' | 'gadget' | 'light' | 'toy' // デバイスタイプ
          battery_type: string                                                 // 使用する電池タイプ
          battery_count: number                                                // 必要な電池数
          battery_life_weeks: number | null                                    // 予想電池寿命（週単位）
          purchase_date: string | null                                         // 購入日
          notes: string | null                                                 // 追加メモ
          image_url: string | null                                             // デバイス画像のURL
          created_at: string                                                   // 作成日時
          user_id: string                                                      // 所有ユーザーのID
          last_battery_change: string | null                                   // 最後に電池を交換した日時
          has_batteries: boolean                                               // 現在電池が装着されているか
        }
        /**
         * テーブルに新規レコードを挿入する際の型定義
         */
        Insert: {
          id?: string                                                          // 自動生成可能なID
          name: string                                                         // 必須: デバイス名
          type: 'smartphone' | 'speaker' | 'camera' | 'gadget' | 'light' | 'toy' // 必須: デバイスタイプ
          battery_type: string                                                 // 必須: 電池タイプ
          battery_count: number                                                // 必須: 電池数
          battery_life_weeks?: number | null                                   // オプション: 予想寿命
          purchase_date?: string | null                                        // オプション: 購入日
          notes?: string | null                                                // オプション: メモ
          image_url?: string | null                                            // オプション: 画像URL
          created_at?: string                                                  // オプション: 作成日時（デフォルト値あり）
          user_id: string                                                      // 必須: ユーザーID
          last_battery_change?: string | null                                  // オプション: 最終電池交換日時
          has_batteries?: boolean                                              // オプション: 電池装着状態
        }
        /**
         * テーブルの既存レコードを更新する際の型定義
         */
        Update: {
          id?: string                                                          // 更新対象のID
          name?: string                                                        // デバイス名
          type?: 'smartphone' | 'speaker' | 'camera' | 'gadget' | 'light' | 'toy' // デバイスタイプ
          battery_type?: string                                                // 電池タイプ
          battery_count?: number                                               // 電池数
          battery_life_weeks?: number | null                                   // 予想寿命
          purchase_date?: string | null                                        // 購入日
          notes?: string | null                                                // メモ
          image_url?: string | null                                            // 画像URL
          created_at?: string                                                  // 作成日時
          user_id?: string                                                     // ユーザーID
          last_battery_change?: string | null                                  // 最終電池交換日時
          has_batteries?: boolean                                              // 電池装着状態
        }
      }
    }
    /**
     * データベースビュー定義
     * 現在このスキーマにはビューが定義されていません
     */
    Views: {
      [_ in never]: never
    }
    /**
     * データベース関数定義
     * 現在このスキーマには関数が定義されていません
     */
    Functions: {
      [_ in never]: never
    }
    /**
     * データベース列挙型定義
     * 現在このスキーマには列挙型が定義されていません
     */
    Enums: {
      [_ in never]: never
    }
  }
}
