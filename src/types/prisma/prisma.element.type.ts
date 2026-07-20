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
