import {
  Uploader,
  UploadParams,
} from "@/domain/forum/application/storage/uploader";

interface Upload {
  fileName: string;
  url: string;
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = [];

  async upload(data: UploadParams) {
    const url = `http://localhost:3000/uploads/${data.fileName}`;

    this.uploads.push({
      fileName: data.fileName,
      url,
    });

    return { url };
  }
}
