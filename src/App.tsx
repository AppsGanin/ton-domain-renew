import { useTonAddress } from '@tonconnect/ui-react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/Hero';
import { Toolbar } from './components/Toolbar';
import { Notice } from './components/Notice';
import { DomainList, useDomains, useRenewDomain } from './features/domains';
import styles from './App.module.css';

export default function App() {
  const address = useTonAddress();
  const { domains, loading, error, refresh } = useDomains(address);
  const { renew, renewingNames, busy, maxMessages, notice, dismissNotice } =
    useRenewDomain(refresh);

  return (
    <div className={styles.app}>
      <Header />

      <main className={styles.content}>
        {!address ? (
          <Hero />
        ) : (
          <>
            <Toolbar address={address} loading={loading} onRefresh={refresh} />

            {notice && (
              <Notice kind={notice.kind} onDismiss={dismissNotice}>
                {notice.text}
              </Notice>
            )}

            {error && <Notice kind="error">Не удалось загрузить домены: {error}</Notice>}

            <DomainList
              domains={domains}
              loading={loading}
              busy={busy}
              renewingNames={renewingNames}
              maxMessages={maxMessages}
              onRenew={renew}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
