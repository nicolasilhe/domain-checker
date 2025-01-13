"use client";

import { DomainForm } from "@/components/domain-form";
import { DomainHistory } from "@/components/domain-history";
import { useDomainHistory } from "@/hooks/use-domain-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

export default function Home() {
  const { history, clearHistory, addToHistory } = useDomainHistory();

  console.log("Current history:", history); // Debug

  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading...</div>}>
        <Card>
          <CardHeader>
            <CardTitle>Domain Check</CardTitle>
          </CardHeader>
          <CardContent>
            <DomainForm onResultChange={addToHistory} />
          </CardContent>
        </Card>
      </Suspense>

      <DomainHistory
        history={history}
        onClear={clearHistory}
        onSelect={(domain) => {
          const input =
            document.querySelector<HTMLInputElement>('input[type="text"]');
          if (input) {
            input.value = domain;
          }
        }}
      />
    </div>
  );
}
