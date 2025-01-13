"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { DomainResult } from "./domain-result";
import type { DomainCheckResult } from "@/types/domain";

export const DomainCheckerForm = () => {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<DomainCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/check-domain?domain=${domain}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Entrez un nom de domaine"
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Vérification..." : "Vérifier"}
          </Button>
        </div>
      </form>

      {result && <DomainResult result={result} />}
    </div>
  );
};
