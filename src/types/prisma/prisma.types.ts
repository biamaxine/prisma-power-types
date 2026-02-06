import { PickBySuffix, PickByType, PickOneOf } from '../pick.types';
import { Prettify } from '../prettify.type';

// --- ELEMENT DEFINITIONS ---

/**
 * Interface base que todo modelo Prisma deve estender para ser compatível com estes utilitários.
 *
 * Garante a presença de um `id` e permite indexação por string.
 */
export interface PrismaElement {
  /**
   * Apesar de a propriedade aceitar ambos, é comum utilizarmos um único tipo para IDs no banco de dados.
   *
   * @type {string | number} - Suporte para UUID e autoincrement
   */
  id: string | number;
  [key: string]: unknown;
}

const SortOrder = {
  asc: 'asc',
  desc: 'desc',
} as const;

type SortOrder = keyof typeof SortOrder;

const NullsOrder = {
  first: 'first',
  last: 'last',
} as const;

type NullsOrder = keyof typeof NullsOrder;

/**
 * Estrutura para definir a ordenação de campos que podem ser nulos.
 */
interface SortOrderInput {
  sort: SortOrder;
  nulls?: NullsOrder;
}

/**
 * Identifica as chaves de metadados padrão do Prisma que geralmente não devem ser manipuladas manualmente.
 *
 * Inclui 'id' e quaisquer chaves terminadas em '_at' (ex: created_at).
 *
 * @template T - O tipo do objeto de origem.
 */
type PrismaElementMetadata<T extends PrismaElement> =
  | 'id'
  | keyof PickBySuffix<T, '_at' | 'At'>; // created_at | createdAt

/**
 * Omite os metadados padrão e chaves adicionais especificadas de um tipo Prisma.
 *
 * @template T - O tipo do objeto de origem.
 * @template K - Chaves adicionais a serem omitidas.
 */
type OmitElementMetadatas<
  T extends PrismaElement,
  K extends Exclude<keyof T, PrismaElementMetadata<T>> = never,
> = Omit<T, PrismaElementMetadata<T> | K>;

// --- UTILITARIES ---

/**
 * Utilitário interno para modificar as propriedades de um tipo Prisma para operações de criação.
 *
 * @template T - O tipo do objeto de origem.
 * @template O - Chaves a serem omitidas.
 * @template R - Chaves a serem tornadas obrigatórias (não nulas).
 * @template P - Chaves a serem tornadas opcionais.
 * @template M - O tipo base com metadados já omitidos.
 */
type Modify<
  T extends PrismaElement,
  O extends Exclude<keyof T, PrismaElementMetadata<T>>,
  R extends Exclude<keyof T, PrismaElementMetadata<T> | O>,
  P extends Exclude<keyof T, PrismaElementMetadata<T> | O | R>,
  M = OmitElementMetadatas<T, O>,
> = {
  // 1. Remove o tipo `null` das chaves definidas em `R`.
  [K in keyof M as K extends R ? K : never]: Exclude<M[K], null>;
} & {
  // 2. Torna opcionas as chaves definidas em `P` (e remove o tipo `null` quando houver).
  [K in keyof M as K extends P ? K : never]?: Exclude<M[K], null>;
} & {
  // 3. Torna todas as chaves anuláveis restantes em opcionais e remove o tipo `null`.
  [K in keyof M as K extends R | P
    ? never
    : null extends M[K]
      ? K
      : never]?: Exclude<M[K], null>;
} & {
  // 4. Mantem o estado original das chaves restantes
  [K in keyof M as K extends R | P
    ? never
    : null extends M[K]
      ? never
      : K]: M[K];
};

// --- ELEMENT CREATE ---

/**
 * Cria um tipo otimizado para a criação de registros Prisma.
 *
 * Remove metadados automáticos e permite ajustar a obrigatoriedade dos campos.
 *
 * @template T - O tipo do modelo Prisma.
 * @template O - Chaves a serem omitidas (além dos metadados padrão).
 * @template R - Chaves que devem ser obrigatórias (remove `null`/`undefined`).
 * @template P - Chaves que devem ser opcionais.
 */
export type PrismaElementCreate<
  T extends PrismaElement,
  O extends Exclude<keyof T, PrismaElementMetadata<T>> = never,
  R extends Exclude<keyof PickByType<T, null>, PrismaElementMetadata<T> | O> =
    never,
  P extends Exclude<keyof T, PrismaElementMetadata<T> | O | R> = never,
> = Prettify<Modify<T, O, R, P>>;

// --- ELEMENT IDENTIFIER ---

/**
 * Define um tipo que exige o `id` OU uma das chaves únicas especificadas.
 *
 * Útil para operações que buscam um registro por identificador único.
 *
 * @template T - O tipo do modelo Prisma.
 * @template K - Chaves únicas adicionais (ex: 'email', 'uuid').
 */
export type PrismaElementIdentifier<
  T extends PrismaElement,
  K extends Exclude<keyof T, 'id'>,
> = Prettify<PickOneOf<T, 'id' | K>>;

// --- ELEMENT FILTER ---

/**
 * Interface padrão para parâmetros de paginação.
 */
export interface PrismaPagination {
  page?: number;
  limit?: number;
}

/**
 * Define a estrutura de ordenação para consultas Prisma.
 *
 * @template T - O tipo do modelo Prisma.
 * @template K - As chaves pelas quais a ordenação é permitida.
 */
export type PrismaElementOrderBy<T extends PrismaElement, K extends keyof T> = {
  [P in K]?: null extends T[P] ? SortOrderInput | SortOrder : SortOrder;
};

// --- ELEMENT UPDATE ---

/**
 * Cria um tipo para atualização de registros Prisma.
 *
 * Remove metadados e torna todas as propriedades restantes opcionais.
 *
 * @template T - O tipo do modelo Prisma.
 * @template O - Chaves adicionais a serem omitidas.
 */
export type PrismaElementUpdate<
  T extends PrismaElement,
  O extends Exclude<keyof T, PrismaElementMetadata<T>> = never,
> = Partial<OmitElementMetadatas<T, O>>;
