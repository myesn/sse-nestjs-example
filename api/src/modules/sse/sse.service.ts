import { Injectable, MessageEvent } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import { fromEvent, map, Observable } from 'rxjs';

// https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html
// https://stackoverflow.com/a/69726444
@Injectable()
export class SseService {
  private readonly emitter: EventEmitter2;
  // 如果是登录用户，存放的是用户Id，如果是没有登录功能的客户端软件，这里传的是客户端软件的名称
  private readonly onlineUserSet: Set<string>;

  constructor() {
    // Inject some Service here and everything about SSE will stop to work.
    this.emitter = new EventEmitter2({
      wildcard: true,
      delimiter: '.',
    });
    this.onlineUserSet = new Set<string>();
  }

  subscribe(userId: string): Observable<MessageEvent> {
    console.log(`subscribe: ${userId}`);
    this.onlineUserSet.add(userId);
    return fromEvent(this.emitter, `${userId}.**`).pipe(
      map((data) => {
        const eventName = (this.emitter as any).event as string;
        return {
          // 消息类型
          type: eventName,
          // 指示客户端，短线重连的间隔时间，单位 ms
          retry: 1000,
          // 消息的自定义数据
          data,
        } as MessageEvent;
      }),
    );
  }

  emit(userId: string, eventName: string, data: any) {
    console.log(`emit: ${userId}.${eventName}: ${data}`);
    this.emitter.emit(`${userId}.${eventName}`, data);
  }
}
