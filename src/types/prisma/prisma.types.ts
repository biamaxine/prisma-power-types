export const SortOrder = {
  asc: 'asc',
  desc: 'desc',
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export const NullsOrder = {
  first: 'first',
  last: 'last',
} as const;

export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

/** Estrutura para definir a ordenação de campos que podem ser nulos. */
export interface SortOrderInput {
  sort: SortOrder;
  nulls?: NullsOrder;
}
