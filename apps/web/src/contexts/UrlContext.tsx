/* eslint-disable @eslint-react/hooks-extra/no-direct-set-state-in-use-effect */
import { createContext, use, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { CleanuriOkResponse } from "~/schemas/cleanuriSchemas";

const STORAGE_KEY = "shortly";
const isBrowser = typeof window !== "undefined";

export type UrlCheckResult =
  | { exists: false }
  | { exists: true; duplicateUrl: CleanuriOkResponse };

interface UrlContextType {
  urls: CleanuriOkResponse[];
  addUrl: (url: CleanuriOkResponse) => void;
  checkUrl: (originalUrl: string) => UrlCheckResult;
  copyUrl: (url: CleanuriOkResponse) => void;
  isInitialized: boolean;
};

const UrlContext = createContext<UrlContextType | undefined>(undefined);

export const UrlProvider = ({ children }: { children: ReactNode }) => {
  const [urls, setUrls] = useState<CleanuriOkResponse[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isBrowser) {
      setIsInitialized(true);
      return;
    }

    try {
      const storedUrls = localStorage.getItem(STORAGE_KEY);
      const parsedUrls = storedUrls ? (JSON.parse(storedUrls) as CleanuriOkResponse[]) : [];
      setUrls(parsedUrls);
    } catch (error) {
      console.error("Failed to parse stored URLs", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const checkUrl = (originalUrl: string): UrlCheckResult => {
    const normalizedUrl = originalUrl.trim().toLowerCase();
    const existingUrl = urls.find(
      (url) => url.originalUrl.trim().toLowerCase() === normalizedUrl,
    );

    if (existingUrl) {
      return { exists: true, duplicateUrl: existingUrl };
    }

    return { exists: false };
  };

  const addUrl = (url: CleanuriOkResponse) => {
    if (!isBrowser) return;

    const urlCheck = checkUrl(url.originalUrl);
    if (urlCheck.exists) {
      throw new Error(`URL already shortened to ${urlCheck.duplicateUrl.resultUrl}`);
    }

    setUrls((prevUrls) => {
      const newUrls = [url, ...prevUrls];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUrls));
      } catch (error) {
        console.error("Failed to save URLs to localStorage", error);
      }
      return newUrls;
    });
  };

  const copyUrl = (url: CleanuriOkResponse) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (isBrowser && navigator.clipboard) {
      void navigator.clipboard
        .writeText(url.resultUrl)
        .catch((err) => console.error("Failed to copy URL", err));
    }
  };

  return (
    // eslint-disable-next-line @eslint-react/no-unstable-context-value
    <UrlContext value={{ urls, addUrl, checkUrl, copyUrl, isInitialized }}>
      {children}
    </UrlContext>
  );
};

export const useUrlContext = (): UrlContextType => {
  const context = use(UrlContext);
  if (context === undefined) {
    throw new Error("useUrlContext must be used within a UrlProvider");
  }
  return context;
};
