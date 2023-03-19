import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SseModule } from './modules/sse/sse.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [SseModule],
})
export class AppModule {}
