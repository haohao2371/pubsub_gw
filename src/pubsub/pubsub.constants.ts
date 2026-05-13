export const BROKERS = ['kafka', 'redis', 'rabbitmq'] as const;
export type MessageBroker = (typeof BROKERS)[number];

export const CHANNELS = ['transactions', 'orders', 'accounts', 'payments', 'logs'] as const;
export type ChannelName = (typeof CHANNELS)[number];

export interface ChannelDefinition {
  name: ChannelName;
  description: string;
  sampleSubscribers: string[];
}

export const CHANNEL_DEFINITIONS: Record<ChannelName, ChannelDefinition> = {
  transactions: {
    name: 'transactions',
    description: 'Financial transaction events for ledgers and auditing.',
    sampleSubscribers: ['ledger-projection', 'fraud-monitor'],
  },
  orders: {
    name: 'orders',
    description: 'Order lifecycle events for checkout and fulfilment.',
    sampleSubscribers: ['inventory-sync', 'shipment-orchestrator'],
  },
  accounts: {
    name: 'accounts',
    description: 'Account profile and lifecycle events.',
    sampleSubscribers: ['crm-sync', 'identity-audit'],
  },
  payments: {
    name: 'payments',
    description: 'Payment authorisation and settlement events.',
    sampleSubscribers: ['billing-ledger', 'payment-reconciliation'],
  },
  logs: {
    name: 'logs',
    description: 'Operational logs and observability events.',
    sampleSubscribers: ['siem-forwarder', 'retention-archiver'],
  },
};
