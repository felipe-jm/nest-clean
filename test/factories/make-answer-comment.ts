import { faker } from "@faker-js/faker";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  AnswerComment,
  AnswerCommentProps,
} from "@/domain/forum/enterprise/entities/answer-comments";

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
