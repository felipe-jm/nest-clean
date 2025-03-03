import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Env } from "src/env";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService<Env, true>) => {
        const privateKey = configService.get("JWT_PRIVATE_KEY", {
          infer: true,
        });
        const publicKey = configService.get("JWT_PUBLIC_KEY", { infer: true });

        return {
          signOptions: { expiresIn: "1h", algorithm: "RS256" },
          publicKey: Buffer.from(publicKey, "base64"),
          privateKey: Buffer.from(privateKey, "base64"),
        };
      },
    }),
  ],
})
export class AuthModule {}
