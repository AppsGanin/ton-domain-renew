import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { describeExpiry, type ExpiryStatus } from '../../../lib/format';
import type { Domain } from '../types';
import styles from './DomainCard.module.css';

const STATUS_LABEL: Record<ExpiryStatus, string> = {
  expired: 'Истёк',
  critical: 'Скоро истечёт',
  soon: 'Истекает',
  ok: 'Активен',
};

interface Props {
  domain: Domain;
  selected: boolean;
  /** True while this domain is part of an in-flight renewal. */
  renewing: boolean;
  /** True while any renewal is running — locks the controls. */
  busy: boolean;
  onToggleSelect: (domain: Domain) => void;
  onRenew: (domain: Domain) => void;
}

export function DomainCard({ domain, selected, renewing, busy, onToggleSelect, onRenew }: Props) {
  const expiry = describeExpiry(domain.expiringAt);
  const canRenew = domain.itemAddress !== null;

  const className = [
    styles.card,
    styles[`status_${expiry.status}`],
    selected && styles.selected,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={className}>
      <label className={styles.select}>
        <input
          type="checkbox"
          checked={selected}
          disabled={!canRenew || busy}
          onChange={() => onToggleSelect(domain)}
          aria-label={`Выбрать ${domain.name}`}
        />
      </label>

      <div className={styles.info}>
        <div className={styles.heading}>
          <span className={styles.name}>{domain.name}</span>
          <Badge tone={expiry.status}>{STATUS_LABEL[expiry.status]}</Badge>
        </div>
        <div className={styles.meta}>
          <span className={styles.date}>до {expiry.dateLabel}</span>
          <span className={styles.dotSep} aria-hidden="true" />
          <span className={styles.relative}>{expiry.relativeLabel}</span>
        </div>
      </div>

      <Button
        size="sm"
        disabled={!canRenew || busy}
        onClick={() => onRenew(domain)}
        title={canRenew ? 'Продлить' : 'Адрес домена недоступен'}
      >
        {renewing ? 'Подтвердите…' : 'Продлить'}
      </Button>
    </li>
  );
}
