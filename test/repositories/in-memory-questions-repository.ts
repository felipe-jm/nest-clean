import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { DomainEvents } from "@/core/events/domain-events";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionsAttachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) {
      return null;
    }

    return question;
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    return question;
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async create(question: Question) {
    this.items.push(question);

    DomainEvents.dispatchEventsForAggregate(question.id);

    return question;
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items[itemIndex] = question;

    DomainEvents.dispatchEventsForAggregate(question.id);

    return question;
  }

  async delete(question: Question) {
    this.items = this.items.filter((item) => item.id !== question.id);

    await this.questionsAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString()
    );
  }
}
