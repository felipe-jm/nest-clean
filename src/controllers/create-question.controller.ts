import { UseGuards, UsePipes } from "@nestjs/common";
import { Controller, Post, HttpCode } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { UserPayload } from "src/auth/jwt.strategy";

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor() {}

  @Post()
  @HttpCode(201)
  @UsePipes()
  async handle(@CurrentUser() user: UserPayload) {
    console.log(user);

    return "ok";
  }
}
