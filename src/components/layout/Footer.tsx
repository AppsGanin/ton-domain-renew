import { GITHUB_REPO_URL } from '../../config';
import { GithubIcon } from '../ui/GithubIcon';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        className={styles.link}
        href={GITHUB_REPO_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Открыть репозиторий на GitHub"
      >
        <GithubIcon size={20} />
        <span>GitHub</span>
      </a>
    </footer>
  );
}
