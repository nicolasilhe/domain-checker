import { useState, useCallback, useEffect } from "react";
import type { DomainCheckResult } from "@/types/domain";
import { useSearchParams, useRouter } from "next/navigation";

export const useDomainChecker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DomainCheckResult | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const checkDomain = useCallback(
    async (domain: string) => {
      if (!domain) return null;

      setIsLoading(true);
      setError(null);

      try {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("domain", domain.toLowerCase());
        window.history.replaceState(null, "", `?${newSearchParams.toString()}`);

        const response = await fetch(
          `/api/check-domain?domain=${domain.toLowerCase()}`
        );
        const data = await response.json();

        if (!response.ok) {
          console.error("Error during check:", error);
          throw new Error(data.error || "Error during check");
        }

        const resultWithDate = {
          ...data,
          checkedAt: new Date().toISOString(),
        };

        setResult(resultWithDate);
        return resultWithDate;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
        setResult(null);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [searchParams]
  );

  // Check domain from query param on load
  useEffect(() => {
    const domain = searchParams.get("domain");
    if (domain) {
      checkDomain(domain);
    }
  }, [checkDomain, searchParams]);

  return { checkDomain, isLoading, error, result };
};
