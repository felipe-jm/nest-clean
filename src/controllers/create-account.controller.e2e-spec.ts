import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import request from "supertest";
import { hash } from "bcryptjs";

describe("Create account controller (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /accounts", async () => {
    const response = await request(app.getHttpServer()).post("/accounts").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password",
    });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: "john.doe@example.com",
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });

  test("[POST] /sessions", async () => {
    await prisma.user.create({
      data: {
        name: "John Doe",
        email: "john.doe@example.com",
        password: await hash("password", 8),
      },
    });

    const response = await request(app.getHttpServer()).post("/sessions").send({
      email: "john.doe@example.com",
      password: "password",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
