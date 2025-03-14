import { BadRequestException, Delete, UsePipes } from "@nestjs/common";
import { Controller, HttpCode, Param } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";

@Controller("/questions/:id")
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  @UsePipes()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("id") questionId: string
  ) {
    const userId = user.sub;

    const result = await this.deleteQuestion.execute({
      authorId: userId,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
