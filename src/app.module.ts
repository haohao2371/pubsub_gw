import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PubSubModule } from './pubsub/pubsub.module';

@Module({
  imports: [PubSubModule],
  controllers: [HealthController],
})
export class AppModule {}
