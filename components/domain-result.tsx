import { DomainCheckResult } from "@/types/domain";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  GlobeIcon,
  CalendarIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

type DetailRowProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  error?: boolean;
};

const DetailRow = ({
  icon: Icon,
  label,
  value,
  href,
  error,
}: DetailRowProps) => (
  <p className="flex items-center gap-2">
    <Icon className={`h-4 w-4 ${error ? "text-red-400" : "text-gray-400"}`} />
    <span className="font-medium">{label}:</span>{" "}
    {href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800"
      >
        {value}
      </a>
    ) : (
      <span className={error ? "text-red-500" : ""}>{value}</span>
    )}
  </p>
);

export const DomainResult = ({ result }: { result: DomainCheckResult }) => {
  return (
    <Card className="border-primary/10">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          {result.isAvailable ? (
            <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircledIcon className="h-5 w-5 text-green-500" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
              <CrossCircledIcon className="h-5 w-5 text-red-500" />
            </div>
          )}
          <div>
            <p className="font-medium text-base">{result.domain}</p>
          </div>
        </div>

        <div className="pt-3 space-y-2 text-sm">
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
      </CardContent>
    </Card>
  );
};
