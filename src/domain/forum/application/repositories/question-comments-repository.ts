import { QuestionComment } from "../../enterprise/entities/question-comments";

export interface QuestionCommentsRepository {
  findById(id: string): Promise<QuestionComment | null>;
  findManyByQuestionId(
    questionId: string,
    params: { page: number }
  ): Promise<QuestionComment[]>;
  create(questionComment: QuestionComment): Promise<QuestionComment>;
  delete(questionComment: QuestionComment): Promise<void>;
}
