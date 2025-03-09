import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";

describe("Get question by slug controller (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /questions/:slug", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password",
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    await prisma.question.createMany({
      data: [
        {
          title: "New Question 1",
          content: "Question content 1",
          authorId: user.id,
          slug: "new-question-1",
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get("/questions/new-question-1")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: "New Question 1",
      }),
    });
  });
});
