import { PickOneOf } from '../pick.types';
import { Prettify } from '../prettify.type';
import { PrismaElement } from './prisma.element.type';

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
