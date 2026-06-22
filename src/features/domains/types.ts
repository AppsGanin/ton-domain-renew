/** A `.ton` domain owned by the connected wallet. */
export interface Domain {
  /** Full domain name, e.g. "example.ton". */
  name: string;
  /** Unix timestamp (seconds) when the domain expires. */
  expiringAt: number;
  /** Raw address (0:...) of the domain's NFT contract — the renew target. */
  itemAddress: string | null;
}
