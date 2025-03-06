import { HashGenerator } from "@/domain/forum/application/cryptograph/hash-generator";
import { Injectable } from "@nestjs/common";
import { hash, compare } from "bcryptjs";

@Injectable()
export class BcryptHasher implements HashGenerator {
  private readonly HASH_SALT_LENGTH = 8;

  hash(password: string) {
    return hash(password, this.HASH_SALT_LENGTH);
  }

  compare(password: string, hashedPassword: string) {
    return compare(password, hashedPassword);
  }
}
