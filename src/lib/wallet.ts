import type { Wallet } from '@tonconnect/ui-react';

/**
 * Conservative fallback when the wallet doesn't advertise a limit. Legacy
 * wallets (and the deprecated `'SendTransaction'` string feature) cap a single
 * transaction at 4 messages, which is the v4 wallet limit.
 */
const DEFAULT_MAX_MESSAGES = 4;

/**
 * How many messages the connected wallet accepts in one transaction.
 *
 * Wallets declare this via the `SendTransaction` feature: v4 reports 4, the
 * W5 wallet reports 255. We read it straight from the wallet so the batch size
 * always matches what the user's wallet actually supports.
 */
export function getMaxMessages(wallet: Wallet | null): number {
  const features = wallet?.device.features ?? [];
  for (const feature of features) {
    if (typeof feature === 'object' && feature.name === 'SendTransaction') {
      return feature.maxMessages;
    }
  }
  return DEFAULT_MAX_MESSAGES;
}
