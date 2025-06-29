# ADR-002: バッテリーデータアダプター実装戦略

**ステータス**: 提案中  
**作成日**: 2025-06-25  
**関連ADR**: [ADR-001: Component Refactor](./001-component-refactor.md)

## 概要

新型コンポーネントシステム（domain/battery/）と既存データ構造（Battery/）との間の型不整合およびデータ構造の違いを解決するため、段階的なデータアダプター実装戦略を決定する。

## コンテキスト

### 現在の課題

#### 1. 型定義の不整合

**BatteryStatus型の相違**
```typescript
// 既存型（現在使用中）
type BatteryStatus = 'charged' | 'in_use' | 'empty' | 'disposed';

// 新型（未使用）
type BatteryStatus = 'new' | 'active' | 'low' | 'empty' | 'expired' | 'unknown';
```

**BatteryShape型の相違**
```typescript
// 既存型（日本語ベース）
type BatteryShape = '単1形' | '単2形' | '単3形' | '単4形' | '単５形' | 'LR44/SR44' | 'CR2032' | 'CR2025' | 'CR2016' | '9V形' | 'その他';

// 新型（国際標準）
type BatteryShape = 'aa' | 'aaa' | 'c' | 'd' | '9v' | 'cr2032' | 'cr2025' | 'button';
```

#### 2. データ構造の根本的相違

**既存構造（リレーショナル・複合型）**
```typescript
type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'] & {
  batteries?: (Battery & {
    devices?: Database['public']['Tables']['devices']['Row'] | null;
  })[];
};
// 特徴: Supabase Schema依存, 関連データ含有, 国際化対応
```

**新型構造（フラット・シンプル型）**
```typescript
interface BatteryInfo {
  id: string;
  name: string;
  shape: BatteryShape;
  status: BatteryStatus;
  voltage?: number;
  capacity?: number;
  installDate?: Date;
  lastChecked?: Date;
  deviceId?: string;
  deviceName?: string;
}
// 特徴: 独立型定義, フラット構造, TypeScript最適化
```

#### 3. 技術的制約

- **使用状況**: 新型コンポーネント実装率100%、使用率0%
- **データフロー**: Database → API → Query → Store → Component
- **依存関係**: 既存コンポーネントはreact-i18next、Supabase型と密結合
- **移行リスク**: 10箇所の既存使用箇所での回帰テスト必要

### 移行における技術的考慮事項

#### パフォーマンス要件
- データ変換コストの最小化
- メモリ使用量の最適化
- リアルタイム更新の維持

#### 保守性要件
- 型安全性の確保
- テスタビリティの向上
- 段階的移行の実現

## 決定事項

### 実装戦略: ハイブリッド・ブリッジパターン

以下の3段階アプローチを採用する：

#### Phase 1: 型統一層の実装

**1.1 共通型定義の作成**
```typescript
// src/lib/types/battery-unified.ts
export namespace BatteryUnified {
  // 既存型を基準とした統一型（下位互換性確保）
  export type Status = 'charged' | 'in_use' | 'empty' | 'disposed';
  export type Shape = '単1形' | '単2形' | '単3形' | '単4形' | 'CR2032' | 'CR2025' | '9V形' | 'その他';
  
  // 統一データ構造
  export interface BatteryUnified {
    id: string;
    name: string;
    shape: Shape;
    status: Status;
    voltage?: number;
    kind: 'disposable' | 'rechargeable';
    count: number;
    notes?: string;
    imageUrl?: string;
    createdAt: Date;
    userId: string;
    // 拡張フィールド（新型コンポーネント用）
    capacity?: number;
    installDate?: Date;
    lastChecked?: Date;
    deviceId?: string;
    deviceName?: string;
  }
}
```

**1.2 形状変換マッピング**
```typescript
// src/lib/adapters/battery-shape-mapper.ts
export const SHAPE_MAPPING = {
  // 日本語 → 国際標準
  '単1形': 'd',
  '単2形': 'c', 
  '単3形': 'aa',
  '単4形': 'aaa',
  'CR2032': 'cr2032',
  'CR2025': 'cr2025',
  '9V形': '9v',
  'その他': 'button'
} as const;

export const STATUS_MAPPING = {
  // 既存 → 新型表現
  'charged': 'active',
  'in_use': 'active', 
  'empty': 'empty',
  'disposed': 'expired'
} as const;
```

#### Phase 2: アダプター層の実装

**2.1 双方向変換アダプター**
```typescript
// src/lib/adapters/battery-data-adapter.ts
export class BatteryDataAdapter {
  // BatteryGroup → BatteryInfo変換
  static toNewComponentData(group: BatteryGroup): BatteryInfo[] {
    return group.batteries?.map(battery => ({
      id: battery.id,
      name: group.name,
      shape: SHAPE_MAPPING[group.shape] || 'button',
      status: STATUS_MAPPING[battery.status] || 'unknown',
      voltage: group.voltage,
      capacity: this.estimateCapacity(group.shape, group.kind),
      installDate: battery.last_changed_at ? new Date(battery.last_changed_at) : undefined,
      lastChecked: battery.last_checked ? new Date(battery.last_checked) : undefined,
      deviceId: battery.device_id || undefined,
      deviceName: battery.devices?.name
    })) || [];
  }

  // BatteryInfo → BatteryGroup変換（更新操作用）
  static fromNewComponentData(info: BatteryInfo): Partial<BatteryGroup> {
    return {
      name: info.name,
      shape: Object.entries(SHAPE_MAPPING).find(([jp, intl]) => intl === info.shape)?.[0] || 'その他',
      voltage: info.voltage || 1.5,
      notes: info.notes
    };
  }

  private static estimateCapacity(shape: string, kind: string): number | undefined {
    // 形状と種類に基づく容量推定ロジック
    const capacityMap = {
      '単1形': kind === 'rechargeable' ? 10000 : 20000,
      '単2形': kind === 'rechargeable' ? 4000 : 8000,
      '単3形': kind === 'rechargeable' ? 2000 : 3000,
      '単4形': kind === 'rechargeable' ? 800 : 1200,
    };
    return capacityMap[shape];
  }
}
```

**2.2 Store統合アダプター**
```typescript
// src/lib/adapters/battery-store-adapter.ts
export function useBatteryGroupsForNewComponents() {
  const { data: batteryGroups = [], isLoading, error } = useBatteryGroupsQuery();
  
  return useMemo(() => ({
    data: batteryGroups.flatMap(group => BatteryDataAdapter.toNewComponentData(group)),
    isLoading,
    error,
    // 元のBatteryGroupへの逆引きマップ
    getOriginalGroup: (batteryId: string) => {
      return batteryGroups.find(group => 
        group.batteries?.some(battery => battery.id === batteryId)
      );
    }
  }), [batteryGroups, isLoading, error]);
}
```

#### Phase 3: 段階的コンポーネント置き換え

**3.1 新型コンポーネントの更新**
```typescript
// src/components/domain/battery/BatteryListItem.tsx (更新)
interface BatteryListItemProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onClick'> {
  battery: BatteryInfo;
  // 既存データへのアクセス用（移行期間のみ）
  originalGroup?: BatteryGroup;
  onClick?: (battery: BatteryInfo, originalGroup?: BatteryGroup) => void;
  // ... 他のprops
}
```

**3.2 置き換え手順**
1. **BatteryStatusBadge**: 最小リスク（単独コンポーネント）
2. **BatteryShapeSelector**: 中程度リスク（フォーム影響）
3. **BatteryListItem**: 高リスク（画面全体への影響）

### 実装詳細

#### テスト戦略
```typescript
// src/lib/adapters/__tests__/battery-data-adapter.test.ts
describe('BatteryDataAdapter', () => {
  describe('toNewComponentData', () => {
    it('should convert BatteryGroup to BatteryInfo array', () => {
      const mockGroup: BatteryGroup = {
        id: 'group-1',
        name: 'テスト電池',
        shape: '単3形',
        kind: 'rechargeable',
        count: 4,
        voltage: 1.2,
        batteries: [
          { id: 'bat-1', status: 'charged', device_id: 'dev-1' }
        ]
      };
      
      const result = BatteryDataAdapter.toNewComponentData(mockGroup);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'bat-1',
        name: 'テスト電池',
        shape: 'aa', // 単3形 → aa
        status: 'active', // charged → active
        voltage: 1.2
      });
    });
  });

  describe('shape mapping', () => {
    it('should correctly map Japanese shapes to international standards', () => {
      expect(SHAPE_MAPPING['単3形']).toBe('aa');
      expect(SHAPE_MAPPING['CR2032']).toBe('cr2032');
    });
  });
});
```

#### エラーハンドリング
```typescript
export class BatteryAdapterError extends Error {
  constructor(
    message: string,
    public readonly code: 'CONVERSION_FAILED' | 'INVALID_SHAPE' | 'MISSING_DATA',
    public readonly originalData?: any
  ) {
    super(message);
    this.name = 'BatteryAdapterError';
  }
}
```

#### パフォーマンス最適化
```typescript
// メモ化による変換コスト削減
const memoizedAdapter = useMemo(() => ({
  toNewComponentData: memoize(BatteryDataAdapter.toNewComponentData),
  fromNewComponentData: memoize(BatteryDataAdapter.fromNewComponentData)
}), []);
```

## 結果

### 期待される効果

#### 技術的効果
- **段階的移行**: リスクを最小化した漸進的移行
- **型安全性**: 変換時の型エラー防止
- **下位互換性**: 既存機能への影響最小化
- **テスタビリティ**: 各変換ロジックの独立テスト可能

#### ビジネス効果
- **開発速度**: 新機能開発への集中可能
- **保守性**: 一元化されたデータ変換ロジック
- **拡張性**: 将来的なデータ構造変更への対応力

### 実装タイムライン

| Phase | 期間 | 主要作業 | リスクレベル |
|-------|------|----------|------------|
| Phase 1 | 1週間 | 型統一層、マッピング実装 | 低 |
| Phase 2 | 1週間 | アダプター層、Store統合 | 中 |
| Phase 3.1 | 1週間 | StatusBadge置き換え | 低 |
| Phase 3.2 | 2週間 | ShapeSelector置き換え | 中 |
| Phase 3.3 | 2週間 | ListItem置き換え | 高 |

### リスク軽減策

#### データ整合性
- 変換前後のデータ検証
- 実運用データでの変換テスト
- ロールバック可能な実装

#### パフォーマンス
- 変換コストの測定・監視
- 大量データでの負荷テスト
- 必要に応じたキャッシュ実装

## 検討した代替案

### 代替案1: 完全置き換えアプローチ
**内容**: 新型コンポーネントに合わせて既存データ構造を全面変更  
**却下理由**: 
- 影響範囲が広すぎる（10箇所の既存使用箇所）
- 一度にすべてを変更するため回帰リスクが高い
- 国際化機能の一時的な喪失

### 代替案2: 新型コンポーネントの既存構造適応
**内容**: 新型コンポーネントを既存のBatteryGroup型に合わせて修正  
**却下理由**:
- 新型コンポーネントの設計優位性を失う
- フラットで型安全な構造の放棄
- 長期的な技術負債の増大

### 代替案3: 双系統並行運用
**内容**: 新旧システムを完全に分離して並行運用  
**却下理由**:
- コードベースの複雑化
- 同一データへの二重管理
- ユーザー体験の不整合

## 実装開始条件

1. **ADR承認**: 開発チーム・ステークホルダーの合意
2. **テスト環境**: 新型コンポーネントでの統合テスト環境構築
3. **パフォーマンスベースライン**: 現行システムの性能測定完了

## 関連ドキュメント

- [ADR-001: Component Refactor](./001-component-refactor.md)
- [新型コンポーネント設計書](../src/components/domain/battery/README.md)（作成予定）
- [バッテリーデータモデル仕様](../docs/battery-data-model.md)（作成予定）

---

**承認者**: _未承認_  
**実装担当**: _未アサイン_  
**レビュー予定日**: 2025-07-01