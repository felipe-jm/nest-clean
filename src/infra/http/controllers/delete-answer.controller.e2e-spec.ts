import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";
import { AnswerFactory } from "test/factories/make-answer";
import { DatabaseModule } from "@/infra/database/database.module";
import { QuestionFactory } from "test/factories/make-question";

describe("Delete answer controller (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    questionFactory = moduleRef.get(QuestionFactory);

    await app.init();
  });

  test("[DELETE] /answers/:id", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    });

    const answerId = answer.id.toString();

    const response = await request(app.getHttpServer())
      .delete(`/answers/${answerId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(204);

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        id: answerId,
      },
    });

    expect(answerOnDatabase).toBeNull();
  });
});
