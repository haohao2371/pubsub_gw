import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChannelDefinition } from './pubsub.constants';
import { PublishMessageRequest, PublishedMessageResponse } from './pubsub.types';
import { PubSubService } from './pubsub.service';

@Controller('pubsub')
export class PubSubController {
  constructor(private readonly pubSubService: PubSubService) {}

  @Get('channels')
  getChannels(): ChannelDefinition[] {
    return this.pubSubService.listChannels();
  }

  @Get('topology')
  getTopology() {
    return this.pubSubService.getTopology();
  }

  @Post('publish')
  publish(@Body() body: PublishMessageRequest): PublishedMessageResponse {
    return this.pubSubService.publish(body);
  }
}
