"use client";

import { useState } from "react";
import { DomainResult } from "@/components/domain-result";
import { DomainHistory } from "@/components/domain-history";
import { useDomainHistory } from "@/hooks/use-domain-history";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { DomainCheckResult } from "@/types/domain";

const DOMAIN_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

export default function Home() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<DomainCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { history, addToHistory, clearHistory } = useDomainHistory();

  const checkDomain = async (domainToCheck: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/check-domain?domain=${domainToCheck}`);
      const data = await response.json();
      setResult(data);
      addToHistory(data);
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!domain) {
      setError("Veuillez entrer un nom de domaine");
      return;
    }

    if (!DOMAIN_REGEX.test(domain)) {
      setError("Format de domaine invalide");
      return;
    }

    checkDomain(domain);
  };

  const handleHistorySelect = (selectedDomain: string) => {
    setDomain(selectedDomain);
    checkDomain(selectedDomain);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Vérification de domaine</h1>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="text"
            value={domain}
            onChange={(e) => {
              setDomain(e.target.value);
              setError(null);
            }}
            placeholder="Entrez un nom de domaine"
            disabled={isLoading}
            className={error ? "border-red-500" : ""}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Vérification..." : "Vérifier"}
          </Button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>

      {result && <DomainResult result={result} />}

      <DomainHistory
        history={history}
        onClear={clearHistory}
        onSelect={handleHistorySelect}
      />
    </main>
  );
}
