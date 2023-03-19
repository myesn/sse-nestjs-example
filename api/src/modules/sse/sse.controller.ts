import { Controller, Get, MessageEvent, Query, Req, Sse } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  /**
   * https://docs.nestjs.com/techniques/server-sent-events
   * https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
   */
  @Sse()
  sse(
    @Req() request: Request,
    @Query('userId') userId: string,
  ): Observable<MessageEvent> {
    return this.sseService.subscribe(userId);
  }

  @Get('emit')
  emit(
    @Query('userId') userId: string,
    @Query('eventName') eventName: string,
    @Query('eventData') eventData: string,
  ) {
    this.sseService.emit(userId, eventName, eventData);
  }
}
