"use client";

import { DomainForm } from "@/components/domain-form";
import { DomainHistory } from "@/components/domain-history";
import { useDomainHistory } from "@/hooks/use-domain-history";

export default function Home() {
  const { history, addToHistory, clearHistory } = useDomainHistory();

  const handleHistorySelect = (selectedDomain: string) => {
    const input =
      document.querySelector<HTMLInputElement>('input[type="text"]');
    if (input) {
      input.value = selectedDomain;
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Vérification de domaine</h1>

      <DomainForm onResultChange={addToHistory} />

      <DomainHistory
        history={history}
        onClear={clearHistory}
        onSelect={handleHistorySelect}
      />
    </main>
  );
}
