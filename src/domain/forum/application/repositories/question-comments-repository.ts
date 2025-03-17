import { QuestionComment } from "../../enterprise/entities/question-comments";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

export abstract class QuestionCommentsRepository {
  abstract findById(id: string): Promise<QuestionComment | null>;

  abstract findManyByQuestionId(
    questionId: string,
    params: { page: number }
  ): Promise<QuestionComment[]>;

  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    params: { page: number }
  ): Promise<CommentWithAuthor[]>;

  abstract create(questionComment: QuestionComment): Promise<QuestionComment>;
  abstract delete(questionComment: QuestionComment): Promise<void>;
}
