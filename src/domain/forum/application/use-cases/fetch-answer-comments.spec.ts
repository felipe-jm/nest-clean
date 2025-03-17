import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answer Comments Use Case", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository
    );
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it("should be able to fetch answer comments", async () => {
    const student = makeStudent({
      name: "John Doe",
    });

    inMemoryStudentsRepository.items.push(student);

    const comment1 = await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId("answer-1"),
        authorId: student.id,
      })
    );

    const comment2 = await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId("answer-1"),
        authorId: student.id,
      })
    );

    const comment3 = await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId("answer-1"),
        authorId: student.id,
      })
    );

    const result = await sut.execute({
      answerId: "answer-1",
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.answerComments).toHaveLength(3);
      expect(result.value?.answerComments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            authorName: "John Doe",
            commentId: comment1.id,
          }),
          expect.objectContaining({
            authorName: "John Doe",
            commentId: comment2.id,
          }),
          expect.objectContaining({
            authorName: "John Doe",
            commentId: comment3.id,
          }),
        ])
      );
    }
  });

  it("should be able to fetch paginated answer comments", async () => {
    const student = makeStudent({
      name: "John Doe",
    });

    inMemoryStudentsRepository.items.push(student);

    for (let i = 0; i < 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId("answer-1"),
          authorId: student.id,
        })
      );
    }

    const result = await sut.execute({
      answerId: "answer-1",
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.answerComments).toHaveLength(2);
    }
  });
});
