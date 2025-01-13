export const DOMAIN_REGEX = {
  // Support for IDN and new TLDs
  STANDARD: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
  // Support for subdomains
  WITH_SUBDOMAINS:
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
};

export const validateDomain = (
  domain: string
): { isValid: boolean; error?: string } => {
  if (!domain) {
    return { isValid: false, error: "Domain is required" };
  }

  if (domain.length > 253) {
    return { isValid: false, error: "Domain is too long" };
  }

  if (!DOMAIN_REGEX.STANDARD.test(domain)) {
    return { isValid: false, error: "Invalid domain format" };
  }

  return { isValid: true };
};
