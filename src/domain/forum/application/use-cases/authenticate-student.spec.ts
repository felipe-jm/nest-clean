import { AuthenticateStudentUseCase } from "./authenticate-student";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FakeHasher } from "test/cryptograph/fake-hasher";
import { FakeEncrypter } from "test/cryptograph/fake-encrypter";
import { makeStudent } from "test/factories/make-student";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe("Authenticate Student Use Case", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("should be able to authenticate a student", async () => {
    const student = makeStudent({
      email: "john.doe@example.com",
      password: await fakeHasher.hash("123456"),
    });

    await inMemoryStudentsRepository.create(student);

    const result = await sut.execute({
      email: "john.doe@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      access_token: expect.any(String),
    });
  });

  it("should not be able to authenticate a student with wrong credentials", async () => {
    const result = await sut.execute({
      email: "john.doe@example.com",
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
