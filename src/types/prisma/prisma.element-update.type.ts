import { Prettify } from '../prettify.type';
import {
  PrismaElementMetadata,
  PrismaElementNoMetadata,
} from './prisma.element-metadata.type';
import { PrismaElement } from './prisma.element.type';

/**
 * Utilitário interno para processar as propriedades de um PrismaElement em operações de atualização.
 *
 * - Todos os campos são tornados opcionais (undefined)
 *
 * @template T - O tipo do objeto de origem.
 * @template O - Chaves a serem omitidas.
 * @template N - Chaves a serem tornadas obrigatórias (neste caso, apenas não nulas).
 * @template M - O tipo base com metadados já omitidos.
 */
type UpdateProcess<
  T extends PrismaElement,
  O extends Exclude<keyof T, PrismaElementMetadata<T>>,
  N extends Exclude<keyof T, PrismaElementMetadata<T> | O>,
  M = PrismaElementNoMetadata<T, O>,
> = {
  [P in keyof M as P extends N ? P : never]?: NonNullable<M[P]>;
} & {
  [P in keyof M as P extends N ? never : P]?: M[P];
};

/**
 * Cria um tipo para atualização de registros Prisma.
 *
 * Remove metadados e torna todas as propriedades restantes opcionais.
 *
 * @template T - O tipo do modelo Prisma.
 * @template O - Chaves adicionais a serem omitidas.
 * @template N - Chaves adicionais que não devem ser `null`
 */
export type PrismaElementUpdate<
  T extends PrismaElement,
  O extends Exclude<keyof T, PrismaElementMetadata<T>> = never,
  N extends Exclude<keyof T, PrismaElementMetadata<T> | O> = never,
> = Prettify<UpdateProcess<T, O, N>>;
