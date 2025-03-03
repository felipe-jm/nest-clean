import { DomainEvent } from "@/core/events/domain-event";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerComment } from "../entities/answer-comments";

export class AnswerCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public answerComment: AnswerComment;

  constructor(answerComment: AnswerComment) {
    this.answerComment = answerComment;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityId {
    return this.answerComment.id;
  }
}
