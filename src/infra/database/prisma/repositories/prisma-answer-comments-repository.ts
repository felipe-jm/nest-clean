import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comments";

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  findById(id: string): Promise<AnswerComment | null> {
    throw new Error("Method not implemented.");
  }

  findManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]> {
    throw new Error("Method not implemented.");
  }

  create(answerComment: AnswerComment): Promise<AnswerComment> {
    throw new Error("Method not implemented.");
  }

  delete(answerComment: AnswerComment): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
