import whois from "whois-json";
import type { DomainCheckResult } from "@/types/domain";

async function checkHttpStatus(domain: string): Promise<boolean> {
  try {
    const response = await fetch(`https://${domain}`, {
      method: "HEAD",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      redirect: "manual",
    });
    return response.status !== 0;
  } catch {
    return false;
  }
}

export type DomainError = {
  code: "WHOIS_ERROR" | "HTTP_ERROR" | "INVALID_DOMAIN" | "UNKNOWN_ERROR";
  message: string;
};

export async function checkDomainAvailability(
  domain: string
): Promise<DomainCheckResult> {
  console.log(`[Domain Check] Vérification de ${domain}`);

  try {
    const [whoisResult, hasWebServer] = await Promise.allSettled([
      whois(domain).catch((error: Error) => {
        console.error("[WHOIS] Erreur:", error);
        throw { code: "WHOIS_ERROR" as const, message: error.message };
      }),
      checkHttpStatus(domain).catch((error) => {
        console.error("[HTTP] Erreur:", error);
        return false;
      }),
    ]);

    // Gestion plus fine des résultats
    if (whoisResult.status === "rejected") {
      throw whoisResult.reason;
    }

    const whoisData = whoisResult.value;
    const webServerStatus =
      hasWebServer.status === "fulfilled" ? hasWebServer.value : false;

    // Vérification WHOIS
    const isAvailableWhois =
      !whoisData.registrar &&
      !whoisData.domainName &&
      !whoisData["Registry Domain ID"] &&
      !(
        whoisData.text && whoisData.text.toLowerCase().includes("registered")
      ) &&
      !(
        Array.isArray(whoisData.status) &&
        whoisData.status.some(
          (s: string) =>
            s.toLowerCase().includes("registered") ||
            s.toLowerCase().includes("active")
        )
      );

    // Un domaine est considéré comme utilisé si soit le WHOIS indique qu'il est enregistré,
    // soit il a un serveur web actif
    const isAvailable = isAvailableWhois && !webServerStatus;

    return {
      domain,
      isAvailable,
      registrar: whoisData.registrar || undefined,
      creationDate: whoisData.creationDate || undefined,
      expirationDate: whoisData.expirationDate || undefined,
      hasWebServer: webServerStatus,
      checkedAt: new Date().toISOString(),
      error: undefined,
    };
  } catch (error) {
    const domainError: DomainError = {
      code: "UNKNOWN_ERROR",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    };
    throw domainError;
  }
}
