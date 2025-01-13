import { checkDomainAvailability } from "@/lib/domain-checker";
import { NextResponse } from "next/server";
import { validateDomain } from "@/utils/domain-validation";
import { DomainCache } from "@/lib/cache";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain")?.toLowerCase();

    // Enhanced validation
    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    const validation = validateDomain(domain);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Check cache
    const cachedResult = DomainCache.get(domain);
    if (cachedResult) {
      return NextResponse.json(cachedResult);
    }

    const result = await checkDomainAvailability(domain);

    // Cache the result
    DomainCache.set(domain, result);

    return NextResponse.json(result);
  } catch (error) {
    // Check if error matches DomainError structure
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      "message" in error
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Error while checking domain:", error);
    return NextResponse.json(
      {
        error: "An error occurred while checking the domain",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
