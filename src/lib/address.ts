import { Address } from '@ton/core';

/** Abbreviate a wallet address to "ABC123…WXYZ" for compact display. */
export function shortenAddress(address: string): string {
  return address.length > 12 ? `${address.slice(0, 6)}…${address.slice(-4)}` : address;
}

/**
 * Convert any TON address form to the bounceable, user-friendly format that
 * TON Connect requires for transaction messages (it rejects raw "0:hex").
 * Returns null if the address can't be parsed.
 */
export function toFriendlyAddress(address: string): string | null {
  try {
    return Address.parse(address).toString();
  } catch {
    return null;
  }
}
