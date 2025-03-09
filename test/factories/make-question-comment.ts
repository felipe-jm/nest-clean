import { faker } from "@faker-js/faker";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  QuestionComment,
  QuestionCommentProps,
} from "@/domain/forum/enterprise/entities/question-comments";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaQuestionCommentMapper } from "@/infra/database/prisma/mappers/prisma-question-comment-mapper";
import { Injectable } from "@nestjs/common";

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityId
) {
  const questionComment = QuestionComment.create(
    {
      questionId: new UniqueEntityId("1"),
      authorId: new UniqueEntityId("1"),
      content: faker.lorem.paragraph(),
      ...override,
    },
    id
  );

  return questionComment;
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionComment(
    data: Partial<QuestionCommentProps> = {}
  ): Promise<QuestionComment> {
    const questionComment = makeQuestionComment(data);

    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(questionComment),
    });

    return questionComment;
  }
}
