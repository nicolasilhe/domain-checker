import { useState, useEffect } from "react";
import type { DomainCheckResult } from "@/types/domain";

const STORAGE_KEY = "domain-search-history";
const MAX_HISTORY_ITEMS = 10;

export const useDomainHistory = () => {
  const [history, setHistory] = useState<DomainCheckResult[]>([]);

  useEffect(() => {
    // Charger l'historique au montage du composant
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const addToHistory = (result: DomainCheckResult) => {
    setHistory((currentHistory) => {
      // Filtrer les doublons et ajouter le nouveau résultat au début
      const newHistory = [
        result,
        ...currentHistory.filter((item) => item.domain !== result.domain),
      ].slice(0, MAX_HISTORY_ITEMS);

      // Sauvegarder dans le localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  return {
    history,
    addToHistory,
    clearHistory,
  };
};
