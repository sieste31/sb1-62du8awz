// 電池一覧画面のフィルター条件を管理するZustandストア

import { create } from 'zustand';
import type { Database } from './database.types';

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'] & {
  batteries?: (Database['public']['Tables']['batteries']['Row'] & {
    devices?: Database['public']['Tables']['devices']['Row'] | null;
  })[];
};

// 定数定義（BatteryList.tsxから移動）
export const BATTERY_SHAPES = ['すべて', '単1形', '単2形', '単3形', '単4形', '9V形'] as const;
export const BATTERY_KINDS = ['すべて', 'disposable', 'rechargeable'] as const;
export const SORT_OPTIONS = ['登録日（新しい順）', '登録日（古い順）', '名前（昇順）', '名前（降順）'] as const;

export type BatteryShape = typeof BATTERY_SHAPES[number];
export type BatteryKind = typeof BATTERY_KINDS[number];
export type SortOption = typeof SORT_OPTIONS[number];

interface BatteryFilterState {
  // フィルター状態
  selectedShape: BatteryShape;
  selectedKind: BatteryKind;
  searchTerm: string;
  sortOption: SortOption;
  showFilters: boolean;

  // アクション
  setSelectedShape: (type: BatteryShape) => void;
  setSelectedKind: (kind: BatteryKind) => void;
  setSearchTerm: (term: string) => void;
  setSortOption: (option: SortOption) => void;
  setShowFilters: (show: boolean) => void;
  resetFilters: () => void;

  // フィルタリングとソート
  getFilteredAndSortedGroups: (batteryGroups: BatteryGroup[]) => BatteryGroup[];
}

export const useBatteryFilterStore = create<BatteryFilterState>((set, get) => ({
  // 初期状態
  selectedShape: 'すべて',
  selectedKind: 'すべて',
  searchTerm: '',
  sortOption: '登録日（新しい順）',
  showFilters: false,

  // アクション
  setSelectedShape: (shape) => set({ selectedShape: shape }),
  setSelectedKind: (kind) => set({ selectedKind: kind }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSortOption: (option) => set({ sortOption: option }),
  setShowFilters: (show) => set({ showFilters: show }),
  resetFilters: () => set({
    selectedShape: 'すべて',
    selectedKind: 'すべて',
    searchTerm: '',
  }),

  // フィルタリングとソート
  getFilteredAndSortedGroups: (batteryGroups) => {
    const { selectedShape, selectedKind, searchTerm, sortOption } = get();

    return batteryGroups
      .filter(group => {
        const matchesType = selectedShape === 'すべて' || group.shape === selectedShape || group.type === selectedShape;
        const matchesKind = selectedKind === 'すべて' || group.kind === selectedKind;
        const matchesSearch = searchTerm === '' || 
          group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (group.notes && group.notes.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesType && matchesKind && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case '登録日（新しい順）':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case '登録日（古い順）':
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case '名前（昇順）':
            return a.name.localeCompare(b.name);
          case '名前（降順）':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
  }
}));
