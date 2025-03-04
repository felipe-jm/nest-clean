import { Get, UseGuards, Query } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth-guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { z } from "zod";
import { QuestionPresenter } from "../presenters/question-presenter";

const pageQueryParamSchema = z.coerce
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamsSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query("page", pageValidationPipe) page: PageQueryParamsSchema) {
    const result = await this.fetchRecentQuestions.execute({
      page,
    });

    if (result.isLeft()) {
      throw new Error();
    }

    const { questions } = result.value;

    return { questions: questions.map(QuestionPresenter.toHTTP) };
  }
}
