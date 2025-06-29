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

// 逆マッピング（国際標準 → 日本語）
export const REVERSE_SHAPE_MAPPING = Object.fromEntries(
  Object.entries(SHAPE_MAPPING).map(([jp, intl]) => [intl, jp])
) as Record<string, keyof typeof SHAPE_MAPPING>;

// 逆マッピング（新型 → 既存）
export const REVERSE_STATUS_MAPPING = {
  'active': 'charged',
  'empty': 'empty',
  'expired': 'disposed',
  'new': 'charged',
  'low': 'in_use',
  'unknown': 'charged'
} as const;