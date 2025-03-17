import {
  Get,
  Query,
  BadRequestException,
  Param,
  Controller,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { z } from "zod";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter";
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";

const pageQueryParamSchema = z.coerce
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamsSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/answers/:answerId/comments")
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query("page", pageValidationPipe) page: PageQueryParamsSchema,
    @Param("answerId") answerId: string
  ) {
    const result = await this.fetchAnswerComments.execute({
      page,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { answerComments } = result.value;

    return {
      comments: answerComments.map(CommentWithAuthorPresenter.toHTTP),
    };
  }
}
