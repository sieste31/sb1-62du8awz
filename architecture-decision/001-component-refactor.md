# ADR-001: コンポーネントリファクタリング計画（ハイブリッド設計）

## ステータス
**提案中** - 2025-06-16

## 背景

現在のコードベースでは、Tailwind CSSクラスが多くの箇所で重複しており、以下の問題が発生している：

1. **保守性の問題**: 同じスタイルが複数箇所に散らばっているため、デザイン変更時の修正コストが高い
2. **一貫性の欠如**: 似たような見た目のコンポーネントでも微妙にスタイルが異なる
3. **可読性の低下**: 長いTailwindクラス名により、コンポーネントの構造が見えにくい
4. **再利用性の低さ**: 共通のUIパターンが抽象化されていない

## 決定事項

**ハイブリッド設計**を採用し、3層構造でコンポーネントシステムを構築する。

### アーキテクチャ概要

```
src/components/
├── primitives/     # 最基本のコンポーネント
├── composed/       # 組み合わせコンポーネント  
├── domain/         # ドメイン特化コンポーネント
└── [existing/]     # 既存コンポーネント（段階的移行）
```

## 実装計画

### Phase 1: 基盤構築（Week 1-2）

#### 1.1 プリミティブコンポーネントの作成

**優先度: 高** - 最も使用頻度の高いコンポーネントから実装

```typescript
// src/components/primitives/
├── Button/
│   ├── Button.tsx
│   ├── variants.ts
│   ├── types.ts
│   └── index.ts
├── Input/
│   ├── Input.tsx
│   ├── TextArea.tsx
│   ├── Select.tsx
│   └── index.ts
├── Card/
│   ├── Card.tsx
│   ├── CardHeader.tsx
│   ├── CardContent.tsx
│   ├── CardFooter.tsx
│   └── index.ts
├── Badge/
│   ├── Badge.tsx
│   ├── types.ts
│   └── index.ts
└── Layout/
    ├── Container.tsx
    ├── Stack.tsx
    ├── Grid.tsx
    └── index.ts
```

#### 1.2 スタイルトークンシステムの構築

```typescript
// src/styles/
├── tokens.ts        # デザイントークン定義
├── variants.ts      # コンポーネントバリアント
└── utils.ts         # スタイルユーティリティ
```

### Phase 2: 組み合わせコンポーネント（Week 3-4）

#### 2.1 フォーム関連コンポーネント

```typescript
// src/components/composed/FormField/
├── FormField.tsx           # ラベル + 入力 + エラー
├── FormFieldGroup.tsx      # フィールドグループ
├── FormFieldError.tsx      # エラー表示
└── index.ts
```

#### 2.2 リストアイテムコンポーネント

```typescript
// src/components/composed/ListItem/
├── BaseListItem.tsx        # 基本リストアイテム
├── SelectableListItem.tsx  # 選択可能なリストアイテム
├── ExpandableListItem.tsx  # 展開可能なリストアイテム
└── index.ts
```

#### 2.3 ステータス表示コンポーネント

```typescript
// src/components/composed/StatusDisplay/
├── StatusBadge.tsx         # ステータスバッジ
├── StatusIndicator.tsx     # ステータスインジケーター
├── StatusCard.tsx          # ステータス付きカード
└── index.ts
```

#### 2.4 モーダルコンポーネント

```typescript
// src/components/composed/Modal/
├── BaseModal.tsx           # 基本モーダル
├── ConfirmModal.tsx        # 確認モーダル
├── FormModal.tsx           # フォームモーダル
└── index.ts
```

### Phase 3: ドメイン特化コンポーネント（Week 5-6）

#### 3.1 電池関連コンポーネント

```typescript
// src/components/domain/battery/
├── BatteryStatusBadge.tsx      # 電池ステータスバッジ
├── BatteryShapeSelector.tsx    # 電池形状セレクター
├── BatteryListItem.tsx         # 電池リストアイテム
├── BatteryCounter.tsx          # 電池カウンター
└── index.ts
```

#### 3.2 デバイス関連コンポーネント

```typescript
// src/components/domain/device/
├── DeviceTypeSelector.tsx      # デバイスタイプセレクター
├── DeviceBatterySlot.tsx       # デバイス電池スロット
├── DeviceListItem.tsx          # デバイスリストアイテム
├── DeviceStatusIndicator.tsx   # デバイスステータス
└── index.ts
```

#### 3.3 ユーザー関連コンポーネント

```typescript
// src/components/domain/user/
├── UserPlanInfo.tsx            # ユーザープラン情報
├── UserPlanLimitIndicator.tsx  # プラン制限表示
├── UserSettings.tsx            # ユーザー設定
└── index.ts
```

### Phase 4: 段階的移行（Week 7-10）

#### 4.1 移行優先順位

1. **高頻度使用コンポーネント**: Button, Input, Card系
2. **リスト系コンポーネント**: BatteryList, DeviceList
3. **フォーム系コンポーネント**: BatteryForm, DeviceForm
4. **詳細画面系コンポーネント**: Detail系コンポーネント

#### 4.2 移行戦略

```typescript
// 移行例: BatteryListItem.tsx
// Before: 直接Tailwindクラス
// After: 新しいcomposedコンポーネントを使用

// 段階的移行アプローチ
import { BaseListItem } from '@/components/composed/ListItem';
import { BatteryStatusBadge } from '@/components/domain/battery';
```

## 技術仕様

### デザイントークン例

```typescript
// src/styles/tokens.ts
export const tokens = {
  colors: {
    primary: {
      50: 'bg-blue-50 text-blue-950',
      100: 'bg-blue-100 text-blue-900',
      500: 'bg-blue-500 text-white',
      600: 'bg-blue-600 text-white',
    },
    secondary: {
      50: 'bg-gray-50 text-gray-950',
      500: 'bg-gray-500 text-white',
    },
    success: {
      50: 'bg-green-50 text-green-950',
      500: 'bg-green-500 text-white',
    },
    warning: {
      50: 'bg-yellow-50 text-yellow-950',
      500: 'bg-yellow-500 text-white',
    },
    danger: {
      50: 'bg-red-50 text-red-950',
      500: 'bg-red-500 text-white',
    }
  },
  spacing: {
    xs: 'p-1',
    sm: 'p-2', 
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  },
  typography: {
    heading: {
      h1: 'text-3xl font-bold leading-tight',
      h2: 'text-2xl font-semibold leading-tight',
      h3: 'text-xl font-semibold leading-snug',
      h4: 'text-lg font-medium leading-snug'
    },
    body: {
      large: 'text-lg leading-relaxed',
      base: 'text-base leading-relaxed',
      small: 'text-sm leading-relaxed'
    }
  },
  borders: {
    none: 'border-0',
    thin: 'border border-gray-200',
    medium: 'border-2 border-gray-300',
    thick: 'border-4 border-gray-400'
  },
  shadows: {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  },
  rounded: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }
};
```

### コンポーネントバリアント例

```typescript
// src/styles/variants.ts
import { tokens } from './tokens';

export const buttonVariants = {
  variant: {
    primary: `${tokens.colors.primary[500]} hover:${tokens.colors.primary[600]}`,
    secondary: `${tokens.colors.secondary[500]} hover:${tokens.colors.secondary[600]}`,
    outline: `border-2 border-current bg-transparent hover:bg-current hover:text-white`,
    ghost: `bg-transparent hover:bg-gray-100`,
  },
  size: {
    xs: `${tokens.spacing.xs} text-xs`,
    sm: `${tokens.spacing.sm} text-sm`,
    md: `${tokens.spacing.md} text-base`,
    lg: `${tokens.spacing.lg} text-lg`,
  }
};
```

## 利点

### 短期的利点
- **一貫性の向上**: 統一されたデザインシステム
- **開発効率の向上**: 再利用可能なコンポーネント
- **保守性の向上**: 一箇所での変更で全体に反映

### 長期的利点
- **拡張性**: 新機能追加時の一貫した実装
- **テスト容易性**: 独立したコンポーネントのテスト
- **ドキュメント化**: Storybookなどの導入が容易

## 考慮事項

### 技術的考慮事項
- **バンドルサイズ**: Tree-shakingの最適化
- **パフォーマンス**: 過度な抽象化を避ける
- **TypeScript**: 型安全性の確保

### チーム的考慮事項
- **学習コスト**: 段階的な導入で軽減
- **既存コードとの互換性**: 両方のアプローチを並行運用
- **レビュープロセス**: 新しいコンポーネント作成時のガイドライン

## 成功指標

### 定量的指標
- **コード重複率**: 50%以上削減
- **コンポーネント再利用率**: 80%以上
- **新機能開発時間**: 30%短縮

### 定性的指標
- **開発者体験の向上**
- **デザインの一貫性向上**
- **保守性の向上**

## 次のステップ

1. **Phase 1の開始**: プリミティブコンポーネントの実装
2. **レビュープロセスの確立**: 新しいコンポーネントの品質基準
3. **ドキュメント整備**: 使用方法とベストプラクティス
4. **段階的移行の開始**: 既存コンポーネントの置換

## 関連資料

- [Tailwind CSS Component Library Best Practices](https://tailwindcss.com/docs/reusing-styles)
- [React Component Design Patterns](https://reactpatterns.com/)
- [Design System Architecture](https://bradfrost.com/blog/post/atomic-web-design/)