import { useTonConnectModal } from "@tonconnect/ui-react";
import { IS_TESTNET } from "../config";
import styles from "./Hero.module.css";
import { Button } from "./ui/Button";

const FEATURES = [
  {
    title: "Все домены сразу",
    text: "Список .ton со сроками и статусом истечения.",
  },
  {
    title: "Продление в клик",
    text: "Одна транзакция продлевает домен на год.",
  },
  { title: "Без комиссии", text: "0.02 TON остаются на контракте домена." },
];

export function Hero() {
  const { open } = useTonConnectModal();

  return (
    <section className={styles.hero}>
      <div className={styles.logoBadge}>
      </div>

      <p className={styles.eyebrow}>
        Domain renew · {IS_TESTNET ? "Testnet" : "Mainnet"}
      </p>

      <h1 className={styles.title}>
        Управляйте своими <span className={styles.accent}>.ton</span> доменами
      </h1>

      <p className={styles.subtitle}>
        Подключите TON-кошелёк, чтобы увидеть свои домены, сроки их истечения и
        продлить их в один клик.
      </p>

      <div className={styles.cta}>
        <Button onClick={() => open()}>Подключить кошелёк</Button>
      </div>

      <ul className={styles.features}>
        {FEATURES.map((f) => (
          <li key={f.title} className={styles.feature}>
            <span className={styles.featureTitle}>{f.title}</span>
            <span className={styles.featureText}>{f.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
