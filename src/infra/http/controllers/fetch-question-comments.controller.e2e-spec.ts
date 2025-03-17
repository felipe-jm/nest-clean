import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "@/infra/app.module";
import { JwtService } from "@nestjs/jwt";
import { DatabaseModule } from "@/infra/database/database.module";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AnswerFactory } from "test/factories/make-answer";
import { QuestionCommentFactory } from "test/factories/make-question-comment";

describe("Fetch question comments controller (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let questionCommentFactory: QuestionCommentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        QuestionCommentFactory,
        AnswerFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    questionCommentFactory = moduleRef.get(QuestionCommentFactory);

    await app.init();
  });

  test("[GET] /questions/:questionId/comments", async () => {
    const user = await studentFactory.makePrismaStudent({
      name: "John Doe",
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      slug: Slug.create("new-question-1"),
      title: "New Question 1",
    });

    await Promise.all([
      questionCommentFactory.makePrismaQuestionComment({
        questionId: question.id,
        authorId: user.id,
        content: "New Question Comment 1",
      }),
      questionCommentFactory.makePrismaQuestionComment({
        questionId: question.id,
        authorId: user.id,
        content: "New Question Comment 2",
      }),
    ]);

    const questionId = question.id.toString();

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          content: "New Question Comment 1",
          authorName: "John Doe",
        }),
        expect.objectContaining({
          content: "New Question Comment 2",
          authorName: "John Doe",
        }),
      ]),
    });
  });
});
