import { PickByType } from '../pick.types';
import { Prettify } from '../prettify.type';
import {
  PrismaElementMetadata,
  PrismaElementNoMetadata,
} from './prisma.element-metadata.type';
import { PrismaElement } from './prisma.element.type';

/**
 * Utilitário interno para processar as propriedades de um PrismaElement em operações de criação.
 *
 * @template T - O tipo do objeto de origem.
 * @template O - Chaves a serem omitidas.
 * @template R - Chaves a serem tornadas obrigatórias (não nulas).
 * @template P - Chaves a serem tornadas opcionais.
 * @template M - O tipo base com metadados já omitidos.
 */
type CreateProcess<
  T extends PrismaElement,
  O extends Exclude<keyof T, PrismaElementMetadata<T>>,
  R extends Exclude<keyof T, PrismaElementMetadata<T> | O>,
  P extends Exclude<keyof T, PrismaElementMetadata<T> | O | R>,
  M = PrismaElementNoMetadata<T, O>,
> = {
  // 1. Remove o tipo `null` das chaves definidas em `R`.
  [K in keyof M as K extends R ? K : never]: NonNullable<M[K]>;
} & {
  // 2. Torna opcionas as chaves definidas em `P` (e remove o tipo `null` quando houver).
  [K in keyof M as K extends P ? K : never]?: NonNullable<M[K]>;
} & {
  // 3. Torna todas as chaves anuláveis restantes em opcionais e remove o tipo `null`.
  [
    K in keyof M as K extends R | P ? never : null extends M[K] ? K : never
  ]?: NonNullable<M[K]>;
} & {
  // 4. Mantem o estado original das chaves restantes
  [
    K in keyof M as K extends R | P ? never : null extends M[K] ? never : K
  ]: M[K];
};

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
> = Prettify<CreateProcess<T, O, R, P>>;
