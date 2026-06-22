import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { UserRejectsError, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { RENEW_BATCH_GAP_MS, RENEW_REFRESH_DELAY_MS } from '../../config';
import { chunk } from '../../lib/chunk';
import { plural } from '../../lib/plural';
import { getMaxMessages } from '../../lib/wallet';
import { buildRenewTransaction } from './renew';
import type { Domain } from './types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface Notice {
  kind: 'success' | 'error' | 'info';
  text: string;
}

interface RenewController {
  /** Renew one or many domains, splitting into wallet-sized batches. */
  renew: (domains: Domain[]) => Promise<void>;
  /** Names of the domains in the in-flight operation (empty when idle). */
  renewingNames: Set<string>;
  /** True while a renewal is awaiting wallet confirmation. */
  busy: boolean;
  /** Max domains the connected wallet can renew per transaction. */
  maxMessages: number;
  /** Latest result notice, or null when there is nothing to show. */
  notice: Notice | null;
  dismissNotice: () => void;
}

const DOMAIN_FORMS: [string, string, string] = ['домен', 'домена', 'доменов'];

function domains(n: number): string {
  return `${n} ${plural(n, DOMAIN_FORMS)}`;
}

function successNotice(count: number, batches: number): Notice {
  const tail = 'Дата истечения обновится через 1–2 минуты.';
  if (count === 1) {
    return { kind: 'success', text: `Транзакция на продление отправлена. ${tail}` };
  }
  if (batches === 1) {
    return { kind: 'success', text: `Отправлена транзакция на продление ${domains(count)}. ${tail}` };
  }
  return {
    kind: 'success',
    text: `Отправлено ${batches} транзакций на продление ${domains(count)}. ${tail}`,
  };
}

/**
 * Map a thrown sendTransaction error to a notice. A wallet cancellation is an
 * expected outcome (info, not error); anything else is a real failure whose
 * message we surface and log. `done` lets us report partial progress when a
 * multi-batch run is interrupted midway.
 */
function failureNotice(error: unknown, done: number, total: number): Notice {
  if (error instanceof UserRejectsError) {
    return done > 0
      ? { kind: 'info', text: `Продлено ${done} из ${total}, остальное отменено.` }
      : { kind: 'info', text: 'Продление отменено в кошельке.' };
  }
  console.error('Renew failed:', error);
  const reason = error instanceof Error ? error.message : String(error);
  const progress = done > 0 ? ` (успешно продлено ${done} из ${total})` : '';
  return { kind: 'error', text: `Не удалось продлить: ${reason}${progress}` };
}

/**
 * Owns the "renew domains" interaction: prompts the wallet (in batches sized to
 * the wallet's message limit), tracks which domains are in flight, surfaces a
 * result notice, and schedules a deferred `onRenewed` to refresh expiry dates.
 */
export function useRenewDomain(onRenewed: () => void): RenewController {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const maxMessages = useMemo(() => getMaxMessages(wallet), [wallet]);

  const [renewingNames, setRenewingNames] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<Notice | null>(null);
  const refreshTimer = useRef<number | undefined>(undefined);

  // Don't fire a deferred refresh into an unmounted tree.
  useEffect(() => () => window.clearTimeout(refreshTimer.current), []);

  const renew = useCallback(
    async (selected: Domain[]) => {
      const targets = selected.filter(
        (d): d is Domain & { itemAddress: string } => d.itemAddress !== null,
      );
      if (targets.length === 0) return;

      setRenewingNames(new Set(targets.map((d) => d.name)));
      setNotice(null);

      const batches = chunk(
        targets.map((d) => d.itemAddress),
        maxMessages,
      );
      let done = 0;
      try {
        for (let i = 0; i < batches.length; i++) {
          // Let the wallet settle before opening the next confirmation.
          if (i > 0 && RENEW_BATCH_GAP_MS > 0) await delay(RENEW_BATCH_GAP_MS);
          await tonConnectUI.sendTransaction(buildRenewTransaction(batches[i]));
          done += batches[i].length;
        }
        setNotice(successNotice(done, batches.length));
        window.clearTimeout(refreshTimer.current);
        refreshTimer.current = window.setTimeout(onRenewed, RENEW_REFRESH_DELAY_MS);
      } catch (error) {
        setNotice(failureNotice(error, done, targets.length));
        // Some batches may already be on-chain — refresh so they show updated.
        if (done > 0) {
          window.clearTimeout(refreshTimer.current);
          refreshTimer.current = window.setTimeout(onRenewed, RENEW_REFRESH_DELAY_MS);
        }
      } finally {
        setRenewingNames(new Set());
      }
    },
    [tonConnectUI, maxMessages, onRenewed],
  );

  const dismissNotice = useCallback(() => setNotice(null), []);

  return {
    renew,
    renewingNames,
    busy: renewingNames.size > 0,
    maxMessages,
    notice,
    dismissNotice,
  };
}
