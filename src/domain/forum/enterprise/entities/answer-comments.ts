import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { CommentProps } from "./comment";
import { AnswerCommentCreatedEvent } from "../events/answer-comment-created-event";
import { AggregateRoot } from "@/core/entities/aggregate-root";

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId;
}

export class AnswerComment extends AggregateRoot<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId;
  }

  get content() {
    return this.props.content;
  }

  get authorId() {
    return this.props.authorId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<AnswerCommentProps, "createdAt">,
    id?: UniqueEntityId
  ) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: new Date(),
      },
      id
    );

    const isNewAnswerComment = !id;

    if (isNewAnswerComment) {
      answerComment.addDomainEvent(
        new AnswerCommentCreatedEvent(answerComment)
      );
    }

    return answerComment;
  }
}
