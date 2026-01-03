import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/env';
import { DatabaseModule } from './database/database.module';
import { ContributionsModule } from './contributions/contributions.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    ContributionsModule,
    MembersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
