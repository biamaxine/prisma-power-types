import { PickBySuffix } from '../pick.types';
import { PrismaElement } from './prisma.element.type';

export type PrismaElementForeignKeys<T extends PrismaElement> =
  keyof PickBySuffix<T, 'Id' | '_id'>;
