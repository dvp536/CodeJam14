/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_SOCKET_URL?: string; // Replace with your environment variable names
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  