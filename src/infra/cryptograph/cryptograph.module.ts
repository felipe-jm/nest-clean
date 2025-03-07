import { HashGenerator } from "@/domain/forum/application/cryptograph/hash-generator";
import { Module } from "@nestjs/common";
import { Encrypter } from "@/domain/forum/application/cryptograph/encrypter";

import { BcryptHasher } from "./bcrypt-hasher";
import { JwtEncrypter } from "./jwt-encrypter";
import { HashComparer } from "@/domain/forum/application/cryptograph/hash-comparer";

@Module({
  providers: [
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
  ],
  exports: [HashGenerator, Encrypter, HashComparer],
})
export class CryptographModule {}
