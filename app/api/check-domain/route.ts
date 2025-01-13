import { checkDomainAvailability } from "@/lib/domain-checker";
import { NextResponse } from "next/server";
import { validateDomain } from "@/utils/domain-validation";
import { DomainCache } from "@/lib/cache";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain")?.toLowerCase();

    // Validation améliorée
    if (!domain) {
      return NextResponse.json(
        { error: "Le domaine est requis" },
        { status: 400 }
      );
    }

    const validation = validateDomain(domain);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Vérifier le cache
    const cachedResult = DomainCache.get(domain);
    if (cachedResult) {
      return NextResponse.json(cachedResult);
    }

    const result = await checkDomainAvailability(domain);

    // Mettre en cache
    DomainCache.set(domain, result);

    return NextResponse.json(result);
  } catch (error) {
    // Vérifier si l'erreur correspond à la structure DomainError
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      "message" in error
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Erreur lors de la vérification du domaine:", error);
    return NextResponse.json(
      {
        error: "Une erreur est survenue lors de la vérification du domaine",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
