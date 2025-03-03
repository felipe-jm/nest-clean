import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete Answer Comment Use Case", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();

    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });

  it("should be able to delete a answer comment", async () => {
    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityId("author-1"),
      },
      new UniqueEntityId("answer-comment-1")
    );

    await inMemoryAnswerCommentsRepository.create(newAnswerComment);

    await sut.execute({
      authorId: "author-1",
      answerCommentId: "answer-comment-1",
    });

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a answer comment from another user", async () => {
    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityId("author-1"),
      },
      new UniqueEntityId("answer-comment-1")
    );

    await inMemoryAnswerCommentsRepository.create(newAnswerComment);

    const result = await sut.execute({
      authorId: "author-2",
      answerCommentId: "answer-comment-1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
