import { Prettify } from '../prettify.type';
import { PrismaElement } from './prisma.element.type';
import { SortOrder, SortOrderInput } from './prisma.types';

/**
 * Mapeia um relacionamento do Prisma para uso em utilitários de ordenação.
 *
 * - Este tipo associa o nome de uma propriedade de navegação (relação) à sua
 * respectiva entidade e às chaves que devem ser expostas para ordenação.
 *
 * @template R - O nome da propriedade de relacionamento no modelo Prisma
 * @template T - O tipo da entidade relacionada (deve estender PrismaElement).
 * @template K - As chaves da entidade relacionada permitidas para ordenação.
 *
 * @example
 * type SectorRel = PrismaElementOrderByRelation<'sector', Sector, 'name' | 'createdAt'>;
 *
 * // resultado:
 * // type SectorRel = { sector: { name?: SortOrder; createdAt?: SortOrder } };
 */
export type PrismaElementOrderByRelation<
  R extends string = string,
  T extends PrismaElement = PrismaElement,
  K extends keyof T = keyof T,
> = Record<R, [T, K]>;

/**
 * Define a estrutura de ordenação para consultas Prisma, com suporte a relacionamentos.
 *
 * - Transforma as chaves selecionadas em tipos compatíveis com o Prisma (SortOrder ou SortOrderInput),
 * permitindo também a inclusão de objetos de ordenação aninhados para relações.
 *
 * @template T - O tipo do modelo Prisma principal.
 * @template K - As chaves locais da entidade permitidas para ordenação.
 * @template R - Um array de `PrismaElementOrderByRelation` para incluir ordenação por relacionamentos (padrão: []).
 */
export type PrismaElementOrderBy<
  T extends PrismaElement,
  K extends keyof T,
  R extends PrismaElementOrderByRelation[] = [],
> = Prettify<
  {
    [P in K]?: null extends T[P] ? SortOrderInput | SortOrder : SortOrder;
  } & (R extends Array<infer Relation>
    ? {
        [
          P in Relation as P extends PrismaElementOrderByRelation<infer Name>
            ? Name extends K
              ? never
              : Name
            : never
        ]?: P extends PrismaElementOrderByRelation<
          string,
          infer RelationElement,
          infer RelationKeys
        >
          ? PrismaElementOrderBy<RelationElement, RelationKeys>
          : never;
      }
    : never)
>;
