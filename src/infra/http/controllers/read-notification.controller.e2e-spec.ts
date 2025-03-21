import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module";
import { JwtService } from "@nestjs/jwt";
import { StudentFactory } from "test/factories/make-student";
import { DatabaseModule } from "@/infra/database/database.module";
import { NotificationFactory } from "test/factories/make-notification";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Read notification controller (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let notificationFactory: NotificationFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, NotificationFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    notificationFactory = moduleRef.get(NotificationFactory);

    await app.init();
  });

  test("[PATCH] /notifications/:notificationId/read", async () => {
    const user = await studentFactory.makePrismaStudent({
      name: "John Doe",
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    });

    const notificationId = notification.id.toString();

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(204);

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: {
        recipientId: user.id.toString(),
      },
    });

    expect(notificationOnDatabase?.readAt).not.toBeNull();
  });
});
