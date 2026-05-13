import { PubSubService } from './pubsub.service';

describe('PubSubService', () => {
  let service: PubSubService;

  beforeEach(() => {
    service = new PubSubService();
  });

  it('exposes five sample pub/sub channels', () => {
    const channels = service.listChannels();

    expect(channels).toHaveLength(5);
    expect(channels.map((channel) => channel.name)).toEqual([
      'transactions',
      'orders',
      'accounts',
      'payments',
      'logs',
    ]);
  });

  it('publishes a message with broker routing metadata', () => {
    const published = service.publish({
      broker: 'kafka',
      channel: 'orders',
      payload: {
        orderId: 'ord-100',
        status: 'created',
      },
      correlationId: 'corr-1',
    });

    expect(published).toMatchObject({
      messageId: 'corr-1',
      broker: 'kafka',
      channel: 'orders',
      subscribers: ['inventory-sync', 'shipment-orchestrator'],
      delivery: {
        broker: 'kafka',
        transport: 'topic',
        destination: 'gateway.orders',
        consumerBinding: 'orders-consumer-group',
      },
    });
  });
});
