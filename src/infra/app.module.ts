import { Module } from "@nestjs/common";
import { envSchema } from "./env";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { HttpModule } from "./http/http.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    AuthModule,
    HttpModule,
  ],
})
export class AppModule {}
