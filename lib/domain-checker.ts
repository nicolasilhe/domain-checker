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
  console.log(`[Domain Check] Checking ${domain}`);

  try {
    const [whoisResult, hasWebServer] = await Promise.allSettled([
      whois(domain).catch((error: Error) => {
        console.error("[WHOIS] Error:", error);
        throw { code: "WHOIS_ERROR" as const, message: error.message };
      }),
      checkHttpStatus(domain).catch((error) => {
        console.error("[HTTP] Error:", error);
        return false;
      }),
    ]);

    if (whoisResult.status === "rejected") {
      throw whoisResult.reason;
    }

    const whoisData = whoisResult.value;
    const webServerStatus =
      hasWebServer.status === "fulfilled" ? hasWebServer.value : false;

    // Logs pour le débogage -> Debug logs
    console.log("[WHOIS] Data:", {
      registrar: whoisData.registrar,
      domainName: whoisData.domainName,
      registryDomainId: whoisData["Registry Domain ID"],
      status: whoisData.status,
      text: whoisData.text,
    });

    // WHOIS check avec raisons détaillées -> Detailed WHOIS check
    const isAvailableWhois =
      // Si tous les champs importants sont undefined ou vides -> If all important fields are undefined or empty
      (!whoisData.registrar && !whoisData.text && !whoisData.status) ||
      // Ou si le seul champ non-vide est domainName -> Or if only domainName field is present
      (whoisData.domainName &&
        !whoisData.registrar &&
        !whoisData.text &&
        !whoisData.status &&
        !whoisData["Registry Domain ID"]);

    console.log("[Check] Results:", {
      isAvailableWhois,
      webServerStatus,
      whoisDataEmpty:
        !whoisData.registrar && !whoisData.text && !whoisData.status,
      onlyDomainName:
        whoisData.domainName &&
        !whoisData.registrar &&
        !whoisData.text &&
        !whoisData.status &&
        !whoisData["Registry Domain ID"],
    });

    // Déterminer la raison de l'indisponibilité -> Determine unavailability reason
    let unavailabilityReason = undefined;
    if (!isAvailableWhois) {
      if (whoisData.registrar) {
        unavailabilityReason = `Registered with ${whoisData.registrar}`;
      } else if (whoisData.status && whoisData.status.length > 0) {
        unavailabilityReason = `Status: ${whoisData.status.join(", ")}`;
      } else if (webServerStatus) {
        unavailabilityReason = "Active website detected";
      } else if (whoisData.text) {
        unavailabilityReason = "WHOIS information found";
      } else if (whoisData["Registry Domain ID"]) {
        unavailabilityReason = "Registry ID found";
      } else {
        unavailabilityReason = "Unknown reason";
      }
    }

    const isAvailable = Boolean(isAvailableWhois && !webServerStatus);

    const result: DomainCheckResult = {
      domain,
      isAvailable,
      registrar: whoisData.registrar || undefined,
      creationDate: whoisData.creationDate || undefined,
      expirationDate: whoisData.expirationDate || undefined,
      hasWebServer: webServerStatus,
      checkedAt: new Date().toISOString(),
      status: whoisData.status,
      whoisText: whoisData.text,
      unavailabilityReason,
      error: undefined,
    };

    console.log("[Domain Check] Final result:", result);
    return result;
  } catch (error) {
    console.error("[Domain Check] Error:", error);
    const domainError: DomainError = {
      code: "UNKNOWN_ERROR",
      message: error instanceof Error ? error.message : "Unknown error",
    };
    throw domainError;
  }
}
