import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { IBorrowRepository } from 'src/domain/borrow/__interface__/borrow-repository-interface';
import { UserId } from 'src/domain/user/user-id/user-id';
import { Borrow } from 'src/domain/borrow/borrow';
import { BookId } from 'src/domain/book/book-id/book-id';
import { BorrowId } from '../../../domain/borrow/borrow-id/borrow-id';
import { borrow_histories } from '@prisma/client';
import { borrowConverter } from './borrow-converter';

export type IPrismaBorrow = borrow_histories;

export class BorrowRepository implements IBorrowRepository {
  private readonly prisma: PrismaService;

  constructor(private _prisma: PrismaService) {
    this.prisma = _prisma;
  }

  async findAllByBookId(bookId: BookId): Promise<Borrow[]> {
    const borrows: IPrismaBorrow[] =
      await this.prisma.borrow_histories.findMany({
        where: { book_id: bookId.toString() },
      });
    return borrows.map((one: IPrismaBorrow): Borrow => {
      return borrowConverter(one);
    });
  }

  async findAllByUserId(userId: UserId): Promise<Borrow[]> {
    const borrows: IPrismaBorrow[] =
      await this.prisma.borrow_histories.findMany({
        where: { user_id: userId.toString() },
      });
    return borrows.map((one: IPrismaBorrow): Borrow => {
      return borrowConverter(one);
    });
  }

  async findOne(id: BorrowId): Promise<Borrow | null> {
    const borrow: IPrismaBorrow = await this.prisma.borrow_histories.findUnique(
      {
        where: { id: id.toString() },
      },
    );
    return borrow ? borrowConverter(borrow) : null;
  }

  async save(entity: Borrow): Promise<void> {
    await this.prisma.borrow_histories.upsert({
      where: { id: entity.id.toString() },
      create: {
        id: entity.id.toString(),
        book_id: entity.getBookId().toString(),
        user_id: entity.getUserId().toString(),
        start_at: entity.getStartAt(),
        end_at: entity.getEndAt(),
      },
      update: {
        book_id: entity.getBookId().toString(),
        user_id: entity.getUserId().toString(),
        start_at: entity.getStartAt(),
        end_at: entity.getEndAt(),
      },
    });
  }
}
