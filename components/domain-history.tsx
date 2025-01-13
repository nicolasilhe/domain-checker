import type { DomainCheckResult } from "@/types/domain";
import { Button } from "@/components/ui/button";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  TrashIcon,
  ChevronDownIcon,
  GlobeIcon,
  ExternalLinkIcon,
  CalendarIcon,
  PersonIcon,
  CopyIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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

const HistoryItem = ({ result }: HistoryItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const baseUrl = window.location.origin;
    const url = `${baseUrl}?domain=${result.domain}`;

    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Lien copié !",
        description: "Le lien a été copié dans le presse-papier.",
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive",
      });
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <Card className="w-full border hover:border-primary/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0">
                  {result.isAvailable ? (
                    <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                      <CheckCircledIcon className="h-5 w-5 text-green-500" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
                      <CrossCircledIcon className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate text-base">
                    {result.domain}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {result.isAvailable ? "Disponible" : "Non disponible"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopy}
                        className="h-8 w-8"
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copier le lien</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={`https://${result.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                      >
                        <ExternalLinkIcon className="h-4 w-4" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Visiter le site</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <ChevronDownIcon
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    isOpen && "transform rotate-180"
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-1 mx-1">
          <Card className="border-primary/10 bg-muted/30">
            <CardContent className="p-4 text-sm space-y-3">
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
                      value={new Date(
                        result.expirationDate
                      ).toLocaleDateString()}
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
            </CardContent>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const DomainHistory = ({ history, onClear, onSelect }: Props) => {
  if (history.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">Historique des recherches</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {history.length} domaine{history.length > 1 ? "s" : ""} vérifié
            {history.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
        >
          <TrashIcon className="h-4 w-4 mr-2" />
          Effacer
        </Button>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {history.map((result) => (
          <HistoryItem
            key={result.domain}
            result={result}
            onSelect={onSelect}
          />
        ))}
      </CardContent>
    </Card>
  );
};
