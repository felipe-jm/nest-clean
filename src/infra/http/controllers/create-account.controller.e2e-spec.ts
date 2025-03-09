import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "@/infra/app.module";
import request from "supertest";
import { hash } from "bcryptjs";
import { StudentFactory } from "test/factories/make-student";
import { DatabaseModule } from "@/infra/database/database.module";

describe("Create account controller (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  test("[POST] /sessions", async () => {
    await studentFactory.makePrismaStudent({
      email: "john.doe2@example.com",
      password: await hash("password", 8),
    });

    const response = await request(app.getHttpServer()).post("/sessions").send({
      email: "john.doe2@example.com",
      password: "password",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
