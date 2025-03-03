import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Either, right } from "@/core/either";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";

export interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  content: string;
}

export type SendNotificationUseCaseResponse = Either<
  null,
  { notification: Notification }
>;

export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      content,
      recipientId: new UniqueEntityId(recipientId),
      title,
    });

    await this.notificationRepository.create(notification);

    return right({ notification });
  }
}
