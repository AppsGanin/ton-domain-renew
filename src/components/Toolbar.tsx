import { Button } from './ui/Button';
import { shortenAddress } from '../lib/address';
import styles from './Toolbar.module.css';

interface Props {
  address: string;
  loading: boolean;
  onRefresh: () => void;
}

export function Toolbar({ address, loading, onRefresh }: Props) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.account}>
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.label}>Кошелёк</span>
        <code className={styles.address}>{shortenAddress(address)}</code>
      </div>
      <Button variant="secondary" size="sm" onClick={onRefresh} disabled={loading}>
        {loading ? 'Загрузка…' : 'Обновить'}
      </Button>
    </div>
  );
}
