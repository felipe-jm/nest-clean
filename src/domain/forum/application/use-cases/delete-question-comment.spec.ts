import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete Question Comment Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository
    );

    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to delete a question comment", async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityId("author-1"),
      },
      new UniqueEntityId("question-comment-1")
    );

    await inMemoryQuestionCommentsRepository.create(newQuestionComment);

    await sut.execute({
      authorId: "author-1",
      questionCommentId: "question-comment-1",
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a question comment from another user", async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityId("author-1"),
      },
      new UniqueEntityId("question-comment-1")
    );

    await inMemoryQuestionCommentsRepository.create(newQuestionComment);

    const result = await sut.execute({
      authorId: "author-2",
      questionCommentId: "question-comment-1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
