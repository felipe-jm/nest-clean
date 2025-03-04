import {
  Controller,
  HttpCode,
  Post,
  UsePipes,
  Body,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { z } from "zod";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBody = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBody) {
    const { email, password } = body;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userWithSameEmail) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await compare(password, userWithSameEmail.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const accessToken = this.jwt.sign({
      sub: userWithSameEmail.id,
    });

    return {
      access_token: accessToken,
    };
  }
}
