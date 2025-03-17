import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { DomainEvents } from "@/core/events/domain-events";
import { InMemoryAttachmentsRepository } from "./in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { InMemoryQuestionAttachmentsRepository } from "./in-memory-question-attachments-repository";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository
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

  async findDetailsBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    const author = this.studentsRepository.items.find(
      (item) => item.id === question.authorId
    );

    if (!author) {
      throw new Error(`Author with ID ${question.authorId} not found.`);
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (questionAttachment) => {
        return questionAttachment.questionId.equals(question.id);
      }
    );

    const attachments = questionAttachments.map((item) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(item.attachmentId);
      });

      if (!attachment) {
        throw new Error(`Attachment with ID ${item.attachmentId} not found.`);
      }

      return attachment;
    });

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      authorName: author.name,
      title: question.title,
      slug: question.slug.value,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      attachments,
    });
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async create(question: Question) {
    this.items.push(question);

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems()
    );

    DomainEvents.dispatchEventsForAggregate(question.id);

    return question;
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items[itemIndex] = question;

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems()
    );

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems()
    );

    DomainEvents.dispatchEventsForAggregate(question.id);

    return question;
  }

  async delete(question: Question) {
    this.items = this.items.filter((item) => item.id !== question.id);

    await this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString()
    );
  }
}
