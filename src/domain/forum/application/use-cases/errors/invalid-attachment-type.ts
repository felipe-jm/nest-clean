export class InvalidAttachmentType extends Error {
  constructor(attachmentType: string) {
    super(`Invalid attachment type: ${attachmentType}`);
  }
}
