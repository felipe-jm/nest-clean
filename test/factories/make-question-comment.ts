import { faker } from "@faker-js/faker";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  QuestionComment,
  QuestionCommentProps,
} from "@/domain/forum/enterprise/entities/question-comments";

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
