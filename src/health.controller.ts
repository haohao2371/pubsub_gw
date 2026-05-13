import { Controller, Get } from '@nestjs/common';
import { BROKERS, CHANNELS } from './pubsub/pubsub.constants';

@Controller()
export class HealthController {
  @Get('health')
  getHealth(): { status: string; service: string; brokers: readonly string[]; channels: number } {
    return {
      status: 'ok',
      service: 'pubsub-gateway',
      brokers: BROKERS,
      channels: CHANNELS.length,
    };
  }
}
