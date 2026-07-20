import { PrismaElementPagination } from '../../types/prisma/prisma.element-pagination.type';

export class PrismaElementPaginationDto implements PrismaElementPagination {
  private readonly _page: number;
  private readonly _limit: number;

  page?: number;
  limit?: number;

  constructor(pagination: PrismaElementPagination) {
    const { page = 1, limit = 10 } = pagination;
    this._page = page;
    this._limit = limit;
  }

  get skip(): number {
    const { page = this._page, limit = this._limit } = this;
    return (page - 1) * limit;
  }

  get take(): number {
    return this.limit ?? this._limit;
  }
}
