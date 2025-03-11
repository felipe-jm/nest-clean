import { Attachment } from "../../enterprise/entities/attachment";

export abstract class AttachmentsRepository {
  abstract create(attachment: Attachment): Promise<Attachment>;
}
