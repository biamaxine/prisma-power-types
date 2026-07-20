import {
  NullsOrder,
  SortOrder,
  SortOrderInput,
} from '../../types/prisma/prisma.types';

export function isPrismaSortOrder(value: unknown): value is SortOrder {
  return value === 'asc' || value === 'desc';
}

export function isPrismaNullsOrder(value: unknown): value is NullsOrder {
  return value === 'first' || value === 'last';
}

export function isPrismaSortOrderInput(
  value: unknown,
): value is SortOrderInput {
  if (value === null || typeof value !== 'object' || Array.isArray(value))
    return false;

  for (const k in value) if (!['sort', 'nulls'].includes(k)) return false;

  const { sort, nulls } = value as Record<string, unknown>;

  if (!isPrismaSortOrder(sort)) return false;
  if (nulls !== undefined && !isPrismaNullsOrder(nulls)) return false;

  return true;
}
