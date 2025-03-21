import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { PrismaQuestionDetailsMapper } from "../mappers/prisma-question-details-mapper";
import { DomainEvents } from "@/core/events/domain-events";
import { CacheRepository } from "@/infra/cache/cache-repository";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private cacheRepository: CacheRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheHit = await this.cacheRepository.get(`question:${slug}:details`);

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit);

      return cachedData;
    }

    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
        bestAnswer: true,
        answers: true,
      },
    });

    if (!question) {
      return null;
    }

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question);

    await this.cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify(questionDetails)
    );

    return questionDetails;
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }

  async create(question: Question): Promise<Question> {
    const data = PrismaQuestionMapper.toPrisma(question);

    const prismaQuestion = await this.prisma.question.create({
      data,
    });

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems()
    );

    DomainEvents.dispatchEventsForAggregate(question.id);

    return PrismaQuestionMapper.toDomain(prismaQuestion);
  }

  async save(question: Question): Promise<Question> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await Promise.all([
      this.prisma.question.update({
        where: { id: question.id.toString() },
        data,
      }),

      await this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems()
      ),

      await this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems()
      ),
      this.cacheRepository.delete(`question:${data.slug}:details`),
    ]);

    const prismaQuestion = await this.prisma.question.findUnique({
      where: { id: question.id.toString() },
    });

    if (!prismaQuestion) {
      throw new Error("Question not found");
    }

    DomainEvents.dispatchEventsForAggregate(question.id);

    return PrismaQuestionMapper.toDomain(prismaQuestion);
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({
      where: { id: question.id.toString() },
    });
  }
}
