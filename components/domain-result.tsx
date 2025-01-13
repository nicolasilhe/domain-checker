import type { DomainCheckResult } from "@/types/domain";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  GlobeIcon,
} from "@radix-ui/react-icons";

type Props = {
  result: DomainCheckResult;
};

export const DomainResult = ({ result }: Props) => {
  return (
    <div className="mt-6 p-4 rounded-lg border">
      <div className="flex items-center gap-2">
        {result.isAvailable ? (
          <>
            <CheckCircledIcon className="h-5 w-5 text-green-500" />
            <span className="text-green-600">
              Le domaine {result.domain} est disponible!
            </span>
          </>
        ) : (
          <>
            <CrossCircledIcon className="h-5 w-5 text-red-500" />
            <span className="text-red-600">
              {result.error ||
                `Le domaine ${result.domain} n'est pas disponible.`}
            </span>
          </>
        )}
      </div>
      {!result.isAvailable && (
        <div className="mt-2 text-sm text-gray-600 space-y-1">
          {result.registrar && <p>Registrar: {result.registrar}</p>}
          {result.creationDate && (
            <p>
              Date de création:{" "}
              {new Date(result.creationDate).toLocaleDateString()}
            </p>
          )}
          {result.expirationDate && (
            <p>
              Date d&apos;expiration:{" "}
              {new Date(result.expirationDate).toLocaleDateString()}
            </p>
          )}
          {result.hasWebServer && (
            <p className="flex items-center gap-2">
              <GlobeIcon className="h-4 w-4" />
              Site web actif détecté
            </p>
          )}
        </div>
      )}
    </div>
  );
};
