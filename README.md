# pubsub_gw

Sample NestJS backend for a pub/sub gateway that models three broker integrations:

- Kafka
- Redis Pub/Sub
- RabbitMQ

The service exposes five example channels:

- transactions
- orders
- accounts
- payments
- logs

## Run locally

```bash
npm install
npm run build
npm run start
```

Server endpoints are exposed under `/api`.

## Example endpoints

- `GET /api/health`
- `GET /api/pubsub/channels`
- `GET /api/pubsub/topology`
- `POST /api/pubsub/publish`

Example publish payload:

```json
{
  "broker": "kafka",
  "channel": "transactions",
  "payload": {
    "transactionId": "txn-100",
    "amount": 4250,
    "currency": "USD"
  }
}
```
