import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { plural } from '../../../lib/plural';
import type { Domain } from '../types';
import { DomainCard } from './DomainCard';
import styles from './DomainList.module.css';

interface Props {
  domains: Domain[];
  loading: boolean;
  busy: boolean;
  renewingNames: Set<string>;
  maxMessages: number;
  onRenew: (domains: Domain[]) => void;
}

const TX_FORMS: [string, string, string] = ['транзакция', 'транзакции', 'транзакций'];

/**
 * Renders the domain region: loading placeholder, empty state, or the list
 * with multi-select and a bulk-renew bar. Selection lives here since it is a
 * view concern; the actual renewal is delegated to `onRenew`.
 */
export function DomainList({
  domains,
  loading,
  busy,
  renewingNames,
  maxMessages,
  onRenew,
}: Props) {
  const renewable = useMemo(() => domains.filter((d) => d.itemAddress !== null), [domains]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const selectAllRef = useRef<HTMLInputElement>(null);

  // Drop selected names that no longer exist after a refresh.
  useEffect(() => {
    setSelected((prev) => {
      const live = new Set(renewable.map((d) => d.name));
      const next = new Set([...prev].filter((name) => live.has(name)));
      return next.size === prev.size ? prev : next;
    });
  }, [renewable]);

  const count = selected.size;
  const allSelected = renewable.length > 0 && count === renewable.length;

  // Native checkbox "partial" state when some — but not all — are selected.
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = count > 0 && !allSelected;
    }
  }, [count, allSelected]);

  if (loading && domains.length === 0) {
    return <p className={styles.status}>Загружаем ваши домены…</p>;
  }

  if (domains.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Доменов не найдено</p>
        <p className={styles.emptyText}>На этом кошельке нет .ton доменов.</p>
      </div>
    );
  }

  const toggle = (domain: Domain) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(domain.name)) next.delete(domain.name);
      else next.add(domain.name);
      return next;
    });

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(renewable.map((d) => d.name)));

  const renewSelected = () => {
    onRenew(renewable.filter((d) => selected.has(d.name)));
    setSelected(new Set());
  };

  const batches = Math.ceil(count / maxMessages);

  return (
    <>
      {renewable.length > 0 && (
        <div className={styles.controls}>
          <label className={styles.selectAll}>
            <input
              ref={selectAllRef}
              type="checkbox"
              checked={allSelected}
              disabled={busy}
              onChange={toggleAll}
            />
            <span>{count > 0 ? `Выбрано: ${count}` : 'Выбрать все'}</span>
          </label>

          <div className={styles.controlsRight}>
            {count > 0 ? (
              <>
                {batches > 1 && (
                  <span className={styles.hint}>
                    {batches} {plural(batches, TX_FORMS)}
                  </span>
                )}
                <Button size="sm" onClick={renewSelected} disabled={busy}>
                  {busy ? 'Подтвердите…' : `Продлить выбранные (${count})`}
                </Button>
              </>
            ) : (
              <span className={styles.hint}>до {maxMessages} за раз</span>
            )}
          </div>
        </div>
      )}

      <ul className={styles.list}>
        {domains.map((domain) => (
          <DomainCard
            key={domain.name}
            domain={domain}
            selected={selected.has(domain.name)}
            renewing={renewingNames.has(domain.name)}
            busy={busy}
            onToggleSelect={toggle}
            onRenew={(d) => onRenew([d])}
          />
        ))}
      </ul>
    </>
  );
}
