import { EXPIRING_PERIOD_DAYS, TONAPI_BASE, TONAPI_KEY } from '../../config';
import { toFriendlyAddress } from '../../lib/address';
import type { Domain } from './types';

// Shape of the /dns/expiring response we care about (snake_case from the API).
interface DnsExpiringResponse {
  items?: Array<{
    expiring_at: number;
    name: string;
    dns_item?: { address?: string };
  }>;
}

function authHeaders(): HeadersInit {
  return TONAPI_KEY ? { Authorization: `Bearer ${TONAPI_KEY}` } : {};
}

/**
 * Fetch every `.ton` domain owned by `account` together with its expiry date,
 * sorted soonest-to-expire first.
 *
 * Uses GET /v2/accounts/{account}/dns/expiring?period=N. Because a renewed
 * domain expires at most ~366 days out, a large period returns the full list.
 */
export async function fetchDomains(account: string): Promise<Domain[]> {
  const url = new URL(
    `/v2/accounts/${encodeURIComponent(account)}/dns/expiring`,
    TONAPI_BASE,
  );
  url.searchParams.set('period', String(EXPIRING_PERIOD_DAYS));

  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`TonAPI ${res.status}: ${detail || res.statusText}`);
  }

  const data = (await res.json()) as DnsExpiringResponse;
  return (data.items ?? [])
    .map((it) => ({
      name: it.name,
      expiringAt: it.expiring_at,
      // TonAPI returns raw "0:hex"; TON Connect needs the user-friendly form.
      itemAddress: it.dns_item?.address ? toFriendlyAddress(it.dns_item.address) : null,
    }))
    .sort((a, b) => a.expiringAt - b.expiringAt);
}
