import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GptModule } from './gpt/gpt.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), GptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
