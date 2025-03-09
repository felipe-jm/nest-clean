import { QuestionComment } from "../../enterprise/entities/question-comments";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import { Either, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
interface FetchQuestionCommentsUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    comments: QuestionComment[];
  }
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const comments = await this.questionCommentsRepository.findManyByQuestionId(
      questionId,
      {
        page,
      }
    );

    return right({ comments });
  }
}
