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
      redirect: "manual", // Pour éviter de suivre les redirections
    });

    // Si on obtient une réponse (même une erreur HTTP), le domaine est probablement utilisé
    return response.status !== 0;
  } catch (error) {
    // Une erreur de connexion suggère que le domaine n'a pas de serveur web actif
    return false;
  }
}

export async function checkDomainAvailability(
  domain: string
): Promise<DomainCheckResult> {
  try {
    // Exécuter les deux vérifications en parallèle
    const [whoisResult, hasWebServer] = await Promise.all([
      whois(domain),
      checkHttpStatus(domain),
    ]);

    // Vérification WHOIS
    const isAvailableWhois =
      !whoisResult.registrar &&
      !whoisResult.domainName &&
      !whoisResult["Registry Domain ID"] &&
      !(
        whoisResult.text &&
        whoisResult.text.toLowerCase().includes("registered")
      ) &&
      !(
        whoisResult.status &&
        whoisResult.status.some(
          (s: string) =>
            s.toLowerCase().includes("registered") ||
            s.toLowerCase().includes("active")
        )
      );

    // Un domaine est considéré comme utilisé si soit le WHOIS indique qu'il est enregistré,
    // soit il a un serveur web actif
    const isAvailable = isAvailableWhois && !hasWebServer;

    return {
      domain,
      isAvailable,
      registrar: whoisResult.registrar || undefined,
      creationDate: whoisResult.creationDate || undefined,
      expirationDate: whoisResult.expirationDate || undefined,
      hasWebServer,
      error: undefined,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("no match")
    ) {
      // Vérifier quand même le serveur HTTP dans ce cas
      const hasWebServer = await checkHttpStatus(domain);
      return {
        domain,
        isAvailable: !hasWebServer, // Disponible seulement si pas de serveur web
        hasWebServer,
        error: undefined,
      };
    }

    return {
      domain,
      isAvailable: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la vérification du domaine",
    };
  }
}
