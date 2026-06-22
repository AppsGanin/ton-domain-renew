// ---------------------------------------------------------------------------
// App configuration / verified on-chain constants
// ---------------------------------------------------------------------------

// Network selection. Defaults to mainnet; add `?testnet=true` to the page URL
// to talk to the test network instead (TonAPI requests + the renewal tx).
function detectTestnet(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('testnet') === 'true';
}
export const IS_TESTNET = detectTestnet();

// TonAPI base, picked by network. An API key is optional — keyless requests
// are rate-limited but fine for a personal tool. NOTE: anything in VITE_* is
// bundled into the static site and therefore public, so only put a key here if
// you are comfortable with it being visible.
export const TONAPI_BASE = IS_TESTNET ? 'https://testnet.tonapi.io' : 'https://tonapi.io';
export const TONAPI_KEY = import.meta.env.VITE_TONAPI_KEY as string | undefined;

// .ton domains expire at most ~366 days after the last renewal, so asking for
// the maximum window the API allows (3660 days) returns *every* domain the
// account owns together with its expiry timestamp.
export const EXPIRING_PERIOD_DAYS = 3660;

// Renewal transaction, taken from the reference Tonkeeper implementation:
//   body = change_dns_record(op=0x4eb1f0f9) with key=0 and no value.
// This is a no-op record edit whose only effect is to reset the contract's
// last_fill_up_time, which extends the domain for another year.
export const RENEW_OP_CHANGE_DNS_RECORD = 0x4eb1f0f9;
// 0.02 TON, in nanotons. The amount is held by the domain contract (it is not
// a marketplace fee); excess beyond gas stays on the domain.
export const RENEW_AMOUNT_NANO = "20000000";

// How long the wallet keeps a sendTransaction request valid (seconds).
export const TX_VALID_FOR_SECONDS = 360;

// Renewal does not update expiry instantly; wait before refetching the dates.
export const RENEW_REFRESH_DELAY_MS = 15_000;

// Pause between consecutive batches when a selection is split across several
// transactions. A small gap lets the wallet settle before it pops the next
// confirmation. Set to 0 to fire them back-to-back.
export const RENEW_BATCH_GAP_MS = 2500;

// TON Connect manifest describing this app to the wallet. By default it is
// served alongside the build (public/tonconnect-manifest.json) and resolved
// relative to the current page, so it works on any GitHub Pages path without
// hardcoding a URL. Override with VITE_TONCONNECT_MANIFEST_URL if you host it
// elsewhere.
export const TONCONNECT_MANIFEST_URL = (import.meta.env.VITE_TONCONNECT_MANIFEST_URL as string | undefined) ?? new URL('tonconnect-manifest.json', document.baseURI).href;

// Link shown in the footer. Point it at your repository (or override with
// VITE_GITHUB_REPO_URL).
export const GITHUB_REPO_URL =
  (import.meta.env.VITE_GITHUB_REPO_URL as string | undefined) ??
  'https://github.com/AppsGanin/ton-domain-renew';
