import { Get, UseGuards, Query } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth-guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { z } from "zod";

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
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query("page", pageValidationPipe) page: PageQueryParamsSchema) {
    const perPage = 20;

    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { questions };
  }
}
