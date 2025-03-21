import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";
import { DatabaseModule } from "@/infra/database/database.module";
import { AttachmentFactory } from "test/factories/make-attachment";

describe("Create question controller (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let attachmentFactory: AttachmentFactory;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  test("[POST] /questions", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const attachment1 = await attachmentFactory.makePrismaAttachment();

    const attachment2 = await attachmentFactory.makePrismaAttachment();

    const response = await request(app.getHttpServer())
      .post("/questions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "New Question",
        content: "Question content",
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      });

    expect(response.statusCode).toBe(201);

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: "New Question",
      },
    });

    expect(questionOnDatabase).toBeTruthy();

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDatabase?.id,
      },
    });

    expect(attachmentsOnDatabase).toHaveLength(2);
  });
});
