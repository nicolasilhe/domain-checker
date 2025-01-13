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
          throw new Error(data.error || "Erreur lors de la vérification");
        }

        setResult(data);
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erreur inconnue";
        setError(errorMessage);
        setResult(null);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [searchParams]
  );

  // Vérifier le domaine en query param au chargement
  useEffect(() => {
    const domain = searchParams.get("domain");
    if (domain) {
      checkDomain(domain);
    }
  }, [checkDomain, searchParams]);

  return { checkDomain, isLoading, error, result };
};
