import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private prisma: PrismaService,
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    });

    if (!answer) {
      return null;
    }

    return PrismaAnswerMapper.toDomain(answer);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answers.map(PrismaAnswerMapper.toDomain);
  }

  async create(answer: Answer): Promise<Answer> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    const prismaAnswer = await this.prisma.answer.create({
      data,
    });

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems()
    );

    return PrismaAnswerMapper.toDomain(prismaAnswer);
  }

  async save(answer: Answer): Promise<Answer> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await Promise.all([
      await this.prisma.answer.update({
        where: { id: answer.id.toString() },
        data,
      }),

      await this.answerAttachmentsRepository.createMany(
        answer.attachments.getNewItems()
      ),

      await this.answerAttachmentsRepository.deleteMany(
        answer.attachments.getRemovedItems()
      ),
    ]);

    const prismaAnswer = await this.prisma.answer.findUnique({
      where: { id: answer.id.toString() },
    });

    if (!prismaAnswer) {
      throw new Error("Answer not found");
    }

    return PrismaAnswerMapper.toDomain(prismaAnswer);
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: { id: answer.id.toString() },
    });
  }
}
