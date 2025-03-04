import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comments";

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  findById(id: string): Promise<QuestionComment | null> {
    throw new Error("Method not implemented.");
  }

  findManyByQuestionId(
    questionId: string,
    params: { page: number }
  ): Promise<QuestionComment[]> {
    throw new Error("Method not implemented.");
  }

  create(questionComment: QuestionComment): Promise<QuestionComment> {
    throw new Error("Method not implemented.");
  }

  delete(questionComment: QuestionComment): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
