import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('PubSub gateway (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('lists the sample channels', async () => {
    const response = await request(app.getHttpServer()).get('/api/pubsub/channels').expect(200);

    expect(response.body).toHaveLength(5);
    expect(response.body[0]).toMatchObject({
      name: 'transactions',
    });
  });

  it('publishes a sample payment event', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/pubsub/publish')
      .send({
        broker: 'redis',
        channel: 'payments',
        payload: {
          paymentId: 'pay-1',
          amount: 1200,
        },
      })
      .expect(201);

    expect(response.body).toMatchObject({
      broker: 'redis',
      channel: 'payments',
      subscribers: ['billing-ledger', 'payment-reconciliation'],
      delivery: {
        broker: 'redis',
        transport: 'channel',
        destination: 'pubsub:payments',
      },
    });
  });
});
