import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "@/infra/app.module";
import { JwtService } from "@nestjs/jwt";
import { DatabaseModule } from "@/infra/database/database.module";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";

describe("Fetch recent questions controller (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);

    await app.init();
  });

  test("[GET] /questions", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    await Promise.all([
      questionFactory.makePrismaQuestion({
        authorId: user.id,
        slug: Slug.create("new-question-1"),
        title: "New Question 1",
      }),
      questionFactory.makePrismaQuestion({
        authorId: user.id,
        slug: Slug.create("new-question-2"),
        title: "New Question 2",
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get("/questions")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({
          title: "New Question 1",
        }),
        expect.objectContaining({
          title: "New Question 2",
        }),
      ]),
    });
  });
});
