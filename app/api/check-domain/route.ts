import { checkDomainAvailability } from "@/lib/domain-checker";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json(
        { error: "Le paramètre domaine est requis" },
        { status: 400 }
      );
    }

    // Validation basique du format du domaine
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: "Format de domaine invalide" },
        { status: 400 }
      );
    }

    const result = await checkDomainAvailability(domain);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
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
