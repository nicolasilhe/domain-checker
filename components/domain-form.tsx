import { useState } from "react";
import { useDomainChecker } from "@/hooks/use-domain-checker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { DomainResult } from "./domain-result";
import type { DomainCheckResult } from "@/types/domain";

type Props = {
  onResultChange?: (result: DomainCheckResult) => void;
};

export const DomainForm = ({ onResultChange }: Props) => {
  const { checkDomain, isLoading, error, result } = useDomainChecker();
  const [domain, setDomain] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      const result = await checkDomain(domain.trim());
      if (result && onResultChange) {
        onResultChange(result);
      }
    }
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Vérification de domaine"
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Entrez un nom de domaine"
              disabled={isLoading}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "domain-error" : undefined}
              className={error ? "border-red-500" : ""}
            />
            {error && (
              <p
                id="domain-error"
                className="mt-1 text-sm text-red-500"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isLoading} aria-busy={isLoading}>
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Vérification...
              </>
            ) : (
              "Vérifier"
            )}
          </Button>
        </div>
      </form>

      {result && <DomainResult result={result} />}
    </div>
  );
};
