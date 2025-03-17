import {
  Get,
  Query,
  BadRequestException,
  Param,
  Controller,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { z } from "zod";
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-question-comments";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter";

const pageQueryParamSchema = z.coerce
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamsSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/questions/:questionId/comments")
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

  @Get()
  async handle(
    @Query("page", pageValidationPipe) page: PageQueryParamsSchema,
    @Param("questionId") questionId: string
  ) {
    const result = await this.fetchQuestionComments.execute({
      page,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { comments } = result.value;

    return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) };
  }
}
