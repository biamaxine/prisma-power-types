import { PickBySuffix } from '../pick.types';
import { PrismaElement } from './prisma.element.type';

/**
 * Identifica as chaves de metadados padrão do Prisma que geralmente não devem ser manipuladas manualmente.
 *
 * Inclui 'id' e quaisquer chaves terminadas em '_at' (ex: created_at).
 *
 * @template T - O tipo do objeto de origem.
 */
export type PrismaElementMetadata<T extends PrismaElement> =
  'id' | keyof PickBySuffix<T, '_at' | 'At'>; // created_at | createdAt

/**
 * Omite os metadados padrão e chaves adicionais especificadas de um tipo Prisma.
 *
 * @template T - O tipo do objeto de origem.
 * @template K - Chaves adicionais a serem omitidas.
 */
export type PrismaElementNoMetadata<
  T extends PrismaElement,
  K extends Exclude<keyof T, PrismaElementMetadata<T>> = never,
> = Omit<T, PrismaElementMetadata<T> | K>;
