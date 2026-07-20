/** Interface padrão para parâmetros de paginação. */
export interface PrismaElementPagination {
  page?: number;
  limit?: number;

  get skip(): number;
  get take(): number;
}
