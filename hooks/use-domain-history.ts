import { useState, useEffect, useCallback } from "react";
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

  const addToHistory = useCallback((result: DomainCheckResult) => {
    console.log("Ajout à l'historique:", result); // Debug
    setHistory((currentHistory) => {
      const newHistory = [
        result,
        ...currentHistory.filter((item) => item.domain !== result.domain),
      ].slice(0, MAX_HISTORY_ITEMS);

      // Sauvegarder dans le localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error("Erreur lors de la sauvegarde dans localStorage:", error);
      }

      return newHistory;
    });
  }, []);

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
