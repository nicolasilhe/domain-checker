import { useState, useEffect } from "react";
import { useDomainChecker } from "@/hooks/use-domain-checker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { DomainResult } from "./domain-result";
import type { DomainCheckResult } from "@/types/domain";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

type Props = {
  onResultChange?: (result: DomainCheckResult) => void;
};

export const DomainForm = ({ onResultChange }: Props) => {
  const { checkDomain, isLoading, error, result } = useDomainChecker();
  const [domain, setDomain] = useState("");
  const searchParams = useSearchParams();

  // Initialiser le formulaire avec le domaine en query param
  useEffect(() => {
    const queryDomain = searchParams.get("domain");
    if (queryDomain) {
      setDomain(queryDomain);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      try {
        const result = await checkDomain(domain.trim());
        console.log("Result obtained:", result); // Debug
        if (result && onResultChange) {
          console.log("Calling onResultChange with:", result); // Debug
          onResultChange(result);
        }
      } catch (error) {
        console.error("Error during check:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Domain check"
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter a domain name"
              disabled={isLoading}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "domain-error" : undefined}
              className={cn("w-full", error ? "border-red-500" : "")}
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
          <Button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Check"
            )}
          </Button>
        </div>
      </form>

      {result && <DomainResult result={result} />}
    </div>
  );
};
