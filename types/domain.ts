export type DomainCheckResult = {
  domain: string;
  isAvailable: boolean;
  registrar?: string;
  creationDate?: string;
  expirationDate?: string;
  hasWebServer: boolean;
  error?: string;
  checkedAt: string;
  status?: string[];
  whoisText?: string;
  unavailabilityReason?: string;
};
