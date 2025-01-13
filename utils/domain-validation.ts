export const DOMAIN_REGEX = {
  // Support des IDN et des nouveaux TLD
  STANDARD: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
  // Support des sous-domaines
  WITH_SUBDOMAINS:
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
};

export const validateDomain = (
  domain: string
): { isValid: boolean; error?: string } => {
  if (!domain) {
    return { isValid: false, error: "Le domaine est requis" };
  }

  if (domain.length > 253) {
    return { isValid: false, error: "Le domaine est trop long" };
  }

  if (!DOMAIN_REGEX.STANDARD.test(domain)) {
    return { isValid: false, error: "Format de domaine invalide" };
  }

  return { isValid: true };
};
