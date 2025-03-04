import { PaginationParams } from "@/core/repositories/pagination-params";
import { Question } from "@/domain/forum/enterprise/entities/question";

export abstract class QuestionsRepository {
  abstract findById(id: string): Promise<Question | null>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findManyRecent({ page }: PaginationParams): Promise<Question[]>;
  abstract create(question: Question): Promise<Question>;
  abstract save(question: Question): Promise<Question>;
  abstract delete(question: Question): Promise<void>;
}
