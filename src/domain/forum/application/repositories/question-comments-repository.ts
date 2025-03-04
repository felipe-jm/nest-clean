import { QuestionComment } from "../../enterprise/entities/question-comments";

export abstract class QuestionCommentsRepository {
  abstract findById(id: string): Promise<QuestionComment | null>;
  abstract findManyByQuestionId(
    questionId: string,
    params: { page: number }
  ): Promise<QuestionComment[]>;
  abstract create(questionComment: QuestionComment): Promise<QuestionComment>;
  abstract delete(questionComment: QuestionComment): Promise<void>;
}
