import type { DomainCheckResult } from "@/types/domain";
import { Button } from "@/components/ui/button";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GlobeIcon,
  ExternalLinkIcon,
  CalendarIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

type Props = {
  history: DomainCheckResult[];
  onClear: () => void;
  onSelect: (domain: string) => void;
};

type HistoryItemProps = {
  result: DomainCheckResult;
  onSelect: (domain: string) => void;
};

const DetailRow = ({
  icon: Icon,
  label,
  value,
  href,
  error,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  error?: boolean;
}) => (
  <p className="flex items-center gap-2 group">
    <Icon className={`h-4 w-4 ${error ? "text-red-400" : "text-gray-400"}`} />
    <span className="font-medium">{label}:</span>{" "}
    {href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:underline"
      >
        {value}
        <ExternalLinkIcon className="h-3 w-3" />
      </a>
    ) : (
      <span className={error ? "text-red-500" : ""}>{value}</span>
    )}
  </p>
);

const HistoryItem = ({ result, onSelect }: HistoryItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const timestamp = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getStatusDisplay = () => {
    if (result.error) {
      return {
        variant: "outline" as const,
        icon: <CrossCircledIcon className="h-4 w-4 text-red-500" />,
      };
    }
    if (result.isAvailable) {
      return {
        variant: "success" as const,
        icon: <CheckCircledIcon className="h-4 w-4 text-green-500" />,
      };
    }
    return {
      variant: "outline" as const,
      icon: <CrossCircledIcon className="h-4 w-4 text-red-500" />,
    };
  };

  const status = getStatusDisplay();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border rounded-lg hover:bg-gray-50 transition-colors">
        <CollapsibleTrigger asChild>
          <div className="p-3 cursor-pointer flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Badge
                variant={status.variant}
                className="h-6 w-6 p-0.5 flex items-center justify-center"
              >
                {status.icon}
              </Badge>
              <span className="font-medium">{result.domain}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{timestamp}</span>
              {isOpen ? (
                <ChevronUpIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 pb-3 pt-1 border-t text-sm space-y-2 text-gray-600">
            <DetailRow
              icon={GlobeIcon}
              label="Domaine"
              value={`https://${result.domain}`}
              href={`https://${result.domain}`}
            />

            {result.error && (
              <DetailRow
                icon={CrossCircledIcon}
                label="Erreur"
                value={result.error}
                error
              />
            )}

            {!result.error && (
              <>
                {result.registrar && (
                  <DetailRow
                    icon={PersonIcon}
                    label="Registrar"
                    value={result.registrar}
                  />
                )}
                {result.creationDate && (
                  <DetailRow
                    icon={CalendarIcon}
                    label="Créé le"
                    value={new Date(result.creationDate).toLocaleDateString()}
                  />
                )}
                {result.expirationDate && (
                  <DetailRow
                    icon={CalendarIcon}
                    label="Expire le"
                    value={new Date(result.expirationDate).toLocaleDateString()}
                  />
                )}
                {result.hasWebServer && (
                  <DetailRow
                    icon={GlobeIcon}
                    label="Statut"
                    value="Site web actif"
                  />
                )}
              </>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export const DomainHistory = ({ history, onClear, onSelect }: Props) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Historique des recherches</h2>
          <p className="text-sm text-gray-500">
            {history.length} domaine{history.length > 1 ? "s" : ""} vérifié
            {history.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-red-500 hover:text-red-700"
        >
          <TrashIcon className="h-4 w-4 mr-2" />
          Effacer l&apos;historique
        </Button>
      </div>
      <div className="space-y-2">
        {history.map((result) => (
          <HistoryItem
            key={result.domain}
            result={result}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};
