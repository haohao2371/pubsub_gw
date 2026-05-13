import { ChannelName, MessageBroker } from './pubsub.constants';

export interface PublishMessageRequest {
  broker: MessageBroker;
  channel: ChannelName;
  payload: Record<string, unknown>;
  correlationId?: string;
}

export interface BrokerRoute {
  broker: MessageBroker;
  transport: 'topic' | 'channel' | 'exchange';
  destination: string;
  consumerBinding: string;
}

export interface PublishedMessageResponse {
  messageId: string;
  broker: MessageBroker;
  channel: ChannelName;
  publishedAt: string;
  subscribers: string[];
  delivery: BrokerRoute;
  payload: Record<string, unknown>;
}
