export type DomainCheckResult = {
  domain: string;
  isAvailable: boolean;
  registrar?: string;
  creationDate?: string;
  expirationDate?: string;
  hasWebServer?: boolean;
  error?: string;
};
