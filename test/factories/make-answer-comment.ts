import { faker } from "@faker-js/faker";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  AnswerComment,
  AnswerCommentProps,
} from "@/domain/forum/enterprise/entities/answer-comments";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaAnswerCommentMapper } from "@/infra/database/prisma/mappers/prisma-answer-comment-mapper";

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityId
) {
  const answerComment = AnswerComment.create(
    {
      answerId: new UniqueEntityId("1"),
      authorId: new UniqueEntityId("1"),
      content: faker.lorem.paragraph(),
      ...override,
    },
    id
  );

  return answerComment;
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerComment(
    data: Partial<AnswerCommentProps> = {}
  ): Promise<AnswerComment> {
    const answerComment = makeAnswerComment(data);

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(answerComment),
    });

    return answerComment;
  }
}
