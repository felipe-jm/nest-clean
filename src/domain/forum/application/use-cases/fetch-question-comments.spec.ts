import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch Question Comments Use Case", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository
    );

    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to fetch question comments", async () => {
    const student = makeStudent({
      name: "John Doe",
    });

    inMemoryStudentsRepository.items.push(student);

    const comment1 = await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId("question-1"),
        authorId: student.id,
      })
    );

    const comment2 = await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId("question-1"),
        authorId: student.id,
      })
    );

    const comment3 = await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId("question-1"),
        authorId: student.id,
      })
    );

    const result = await sut.execute({
      questionId: "question-1",
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.comments).toHaveLength(3);
      expect(result.value?.comments).toEqual(
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

  it("should be able to fetch paginated question comments", async () => {
    const student = makeStudent({
      name: "John Doe",
    });

    inMemoryStudentsRepository.items.push(student);

    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId("question-1"),
          authorId: student.id,
        })
      );
    }

    const result = await sut.execute({
      questionId: "question-1",
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.comments).toHaveLength(2);
    }
  });
});
