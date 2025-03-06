import { RegisterStudentUseCase } from "./register-student";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FakeHasher } from "test/cryptograph/fake-hasher";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe("Register Student Use Case", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher);
  });

  it("should be able to register a new student", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        student: expect.objectContaining({
          name: "John Doe",
          email: "john.doe@example.com",
        }),
      })
    );
  });

  it("should hash student password upon registration", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);

    const hashedPassword = await fakeHasher.hash("123456");
    expect(inMemoryStudentsRepository.items[0].password).toEqual(
      hashedPassword
    );
  });
});
