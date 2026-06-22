import { TonConnectButton } from "@tonconnect/ui-react";
import { IS_TESTNET } from "../../config";
import { TonLogo } from "../ui/TonLogo";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.brand} aria-label="TON Domains">
          <TonLogo size={26} />
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>TON Domains</span>
            <span className={styles.brandSubtitle}>продление .ton</span>
          </span>
        </div>
        {IS_TESTNET && <span className={styles.testnet}>Testnet</span>}
      </div>
      <TonConnectButton />
    </header>
  );
}
