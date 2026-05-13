import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  BROKERS,
  CHANNEL_DEFINITIONS,
  CHANNELS,
  ChannelDefinition,
  ChannelName,
  MessageBroker,
} from './pubsub.constants';
import { BrokerRoute, PublishMessageRequest, PublishedMessageResponse } from './pubsub.types';

@Injectable()
export class PubSubService {
  private readonly logger = new Logger(PubSubService.name);

  listChannels(): ChannelDefinition[] {
    return CHANNELS.map((channelName) => CHANNEL_DEFINITIONS[channelName]);
  }

  getTopology(): Array<ChannelDefinition & { routes: BrokerRoute[] }> {
    return this.listChannels().map((channel) => ({
      ...channel,
      routes: BROKERS.map((broker) => this.buildRoute(broker, channel.name)),
    }));
  }

  publish(request: PublishMessageRequest): PublishedMessageResponse {
    this.assertValidBroker(request.broker);
    this.assertValidChannel(request.channel);

    if (!request.payload || Array.isArray(request.payload)) {
      throw new BadRequestException('payload must be a JSON object');
    }

    const channel = CHANNEL_DEFINITIONS[request.channel];

    return {
      messageId: request.correlationId ?? randomUUID(),
      broker: request.broker,
      channel: request.channel,
      publishedAt: new Date().toISOString(),
      subscribers: channel.sampleSubscribers,
      delivery: this.buildRoute(request.broker, request.channel),
      payload: request.payload,
    };
  }

  handleKafkaPaymentsEvent(message: unknown): void {
    this.logger.log(`Received Kafka payments event: ${JSON.stringify(message)}`);
  }

  private assertValidBroker(broker: string): asserts broker is MessageBroker {
    if (!BROKERS.includes(broker as MessageBroker)) {
      throw new BadRequestException(`Unsupported broker: ${broker}`);
    }
  }

  private assertValidChannel(channel: string): asserts channel is ChannelName {
    if (!CHANNELS.includes(channel as ChannelName)) {
      throw new BadRequestException(`Unsupported channel: ${channel}`);
    }
  }

  private buildRoute(broker: MessageBroker, channel: ChannelName): BrokerRoute {
    switch (broker) {
      case 'kafka':
        return {
          broker,
          transport: 'topic',
          destination: `gateway.${channel}`,
          consumerBinding: `${channel}-consumer-group`,
        };
      case 'redis':
        return {
          broker,
          transport: 'channel',
          destination: `pubsub:${channel}`,
          consumerBinding: `psubscribe pubsub:${channel}`,
        };
      case 'rabbitmq':
        return {
          broker,
          transport: 'exchange',
          destination: `gateway.${channel}.exchange`,
          consumerBinding: `${channel}.queue`,
        };
    }
  }
}
