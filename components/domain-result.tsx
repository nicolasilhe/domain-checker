import type { DomainCheckResult } from "@/types/domain";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  result: DomainCheckResult;
};

export const DomainResult = ({ result }: Props) => {
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          {result.isAvailable ? (
            <>
              <CheckCircledIcon className="h-5 w-5 text-green-500 shrink-0" />
              <span className="text-green-600 font-medium">
                Le domaine {result.domain} est disponible!
              </span>
            </>
          ) : (
            <>
              <CrossCircledIcon className="h-5 w-5 text-red-500 shrink-0" />
              <span className="text-red-600 font-medium">
                {result.error ||
                  `Le domaine ${result.domain} n'est pas disponible.`}
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
