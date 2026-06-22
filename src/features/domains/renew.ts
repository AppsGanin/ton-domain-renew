import { beginCell } from '@ton/core';
import { CHAIN, type SendTransactionRequest } from '@tonconnect/ui-react';
import {
  IS_TESTNET,
  RENEW_AMOUNT_NANO,
  RENEW_OP_CHANGE_DNS_RECORD,
  TX_VALID_FOR_SECONDS,
} from '../../config';

/**
 * Build the message body that renews a `.ton` domain.
 *
 *   change_dns_record#4eb1f0f9 query_id:uint64 key:uint256 value:(Maybe ^Cell)
 *
 * With key = 0 and no value cell this is a no-op record edit; its only effect
 * is that the contract refreshes last_fill_up_time, extending the domain by a
 * year. (Matches the reference Tonkeeper implementation.)
 */
function buildRenewBodyBoc(): string {
  const body = beginCell()
    .storeUint(RENEW_OP_CHANGE_DNS_RECORD, 32)
    .storeUint(0, 64) // query_id
    .storeUint(0, 256) // key = 0
    .endCell();
  return body.toBoc().toString('base64');
}

/** One renewal message: the change_dns_record body + gas sent to a domain. */
function buildRenewMessage(itemAddress: string) {
  return {
    address: itemAddress,
    amount: RENEW_AMOUNT_NANO,
    payload: buildRenewBodyBoc(),
  };
}

/**
 * Assemble a TON Connect sendTransaction request that renews one or more
 * domains in a single transaction — one message per domain NFT contract.
 *
 * The caller must keep `itemAddresses.length` within the wallet's per-tx
 * message limit (see getMaxMessages); larger sets should be split first.
 */
export function buildRenewTransaction(itemAddresses: string[]): SendTransactionRequest {
  return {
    validUntil: Math.floor(Date.now() / 1000) + TX_VALID_FOR_SECONDS,
    // Pin the network so the wallet rejects a mismatch instead of signing on
    // the wrong chain (see ?testnet=true).
    network: IS_TESTNET ? CHAIN.TESTNET : CHAIN.MAINNET,
    messages: itemAddresses.map(buildRenewMessage),
  };
}
