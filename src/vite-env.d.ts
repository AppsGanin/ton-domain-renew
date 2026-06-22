/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TONAPI_KEY?: string;
  readonly VITE_TONCONNECT_MANIFEST_URL?: string;
  readonly VITE_GITHUB_REPO_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
