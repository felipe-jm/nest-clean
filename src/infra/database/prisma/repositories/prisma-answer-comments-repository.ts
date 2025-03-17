import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comments";
import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!answerComment) {
      return null;
    }

    return PrismaAnswerCommentMapper.toDomain(answerComment);
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams
  ): Promise<AnswerComment[]> {
    const answerComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answerComments.map(PrismaAnswerCommentMapper.toDomain);
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams
  ): Promise<CommentWithAuthor[]> {
    const questionComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        author: true,
      },
    });

    return questionComments.map(PrismaCommentWithAuthorMapper.toDomain);
  }

  async create(answerComment: AnswerComment): Promise<AnswerComment> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment);

    const prismaAnswerComment = await this.prisma.comment.create({
      data,
    });

    return PrismaAnswerCommentMapper.toDomain(prismaAnswerComment);
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: answerComment.id.toString() },
    });
  }
}
