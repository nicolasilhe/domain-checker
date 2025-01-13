import { useState, useCallback } from "react";
import { validateDomain } from "@/utils/domain-validation";
import type { DomainCheckResult } from "@/types/domain";

export const useDomainChecker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DomainCheckResult | null>(null);

  const checkDomain = useCallback(async (domain: string) => {
    if (!domain) return;

    setIsLoading(true);
    setError(null);

    const validation = validateDomain(domain);
    if (!validation.isValid) {
      setError(validation.error || "Format de domaine invalide");
      setIsLoading(false);
      return;
    }

    try {
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
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { checkDomain, isLoading, error, result };
};
