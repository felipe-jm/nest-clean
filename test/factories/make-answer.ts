import { faker } from "@faker-js/faker";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityId
) {
  const answer = Answer.create(
    {
      content: faker.lorem.paragraph(),
      authorId: new UniqueEntityId("1"),
      questionId: new UniqueEntityId("1"),
      ...override,
    },
    id
  );

  return answer;
}
