import type { ReactNode } from 'react';
import styles from './Notice.module.css';

export type NoticeKind = 'success' | 'error' | 'info';

interface Props {
  kind: NoticeKind;
  children: ReactNode;
  onDismiss?: () => void;
}

export function Notice({ kind, children, onDismiss }: Props) {
  return (
    <div className={`${styles.notice} ${styles[kind]}`} role="status">
      <span className={styles.body}>{children}</span>
      {onDismiss && (
        <button
          type="button"
          className={styles.dismiss}
          onClick={onDismiss}
          aria-label="Закрыть"
        >
          ×
        </button>
      )}
    </div>
  );
}
