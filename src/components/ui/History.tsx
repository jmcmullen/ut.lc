import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useUrlContext } from "~/contexts/UrlContext";
import { CleanuriOkResponse } from "~/schemas/cleanuriSchemas";
import { cn } from "~/utils/cn";
import { Button } from "./Button";

export const History = () => {
  const { urls, copyUrl } = useUrlContext();
  const [copiedUrls, setCopiedUrls] = useState(() => new Set<string>());
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    const timeouts = timeoutRefs.current;
    return () => {
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, []);

  const handleCopy = (url: CleanuriOkResponse) => {
    copyUrl(url);

    if (timeoutRefs.current[url.resultUrl]) {
      clearTimeout(timeoutRefs.current[url.resultUrl]);
    }

    setCopiedUrls((prev) => new Set(prev).add(url.resultUrl));

    timeoutRefs.current[url.resultUrl] = setTimeout(() => {
      setCopiedUrls((prev) => {
        const newSet = new Set(prev);
        newSet.delete(url.resultUrl);
        return newSet;
      });
      delete timeoutRefs.current[url.resultUrl];
    }, 3000);
  };

  return (
    <div className="-mt-24 flex flex-col gap-6 bg-light-gray pt-32">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-6 px-6">
        {urls.map((url) => {
          const isCopied = copiedUrls.has(url.resultUrl);
          return (
            <div
              key={url.resultUrl}
              className="animate-url flex flex-col items-center justify-between gap-x-6 rounded-md bg-white md:flex-row"
            >
              <div className="flex w-full flex-col justify-between divide-y divide-grayish-violet md:flex-row md:divide-y-0 md:text-lg">
                <Link
                  to={url.originalUrl}
                  target="_blank"
                  className="px-4 py-3 hover:underline md:px-6 md:py-6"
                >
                  {url.originalUrl}
                </Link>
                <Link
                  to={url.resultUrl}
                  target="_blank"
                  className="px-4 py-3 text-cyan hover:underline md:px-6 md:py-6"
                >
                  {url.resultUrl}
                </Link>
              </div>
              <div className="w-full px-4 pb-3 md:w-auto md:p-0 md:pr-6">
                <Button
                  size="md"
                  rounded={false}
                  onClick={() => handleCopy(url)}
                  className={cn(
                    "w-full md:w-32",
                    isCopied ? "bg-dark-violet" : "bg-cyan",
                  )}
                >
                  {isCopied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
