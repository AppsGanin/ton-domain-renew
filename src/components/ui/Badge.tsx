import type { ReactNode } from 'react';
import styles from './Badge.module.css';

type Tone = 'ok' | 'soon' | 'critical' | 'expired';

interface Props {
  tone: Tone;
  children: ReactNode;
}

/** Small pill that colour-codes a status. Tone maps to a CSS module class. */
export function Badge({ tone, children }: Props) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
