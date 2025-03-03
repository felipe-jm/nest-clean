import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";

describe("Fetch recent questions controller (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /questions", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password",
      },
    });

    const accessToken = jwt.sign(
      { sub: user.id },
      {
        secret: "secret",
        expiresIn: "1h",
      }
    );

    await prisma.question.createMany({
      data: [
        {
          title: "New Question 1",
          content: "Question content 1",
          authorId: user.id,
          slug: "new-question-1",
        },
        {
          title: "New Question 2",
          content: "Question content 2",
          authorId: user.id,
          slug: "new-question-2",
        },
        {
          title: "New Question 3",
          content: "Question content 3",
          authorId: user.id,
          slug: "new-question-3",
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .post("/questions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "New Question",
        content: "Question content",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({
          title: "New Question 1",
        }),
        expect.objectContaining({
          title: "New Question 2",
        }),
        expect.objectContaining({
          title: "New Question 3",
        }),
      ]),
    });
  });
});
