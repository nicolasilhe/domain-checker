declare module "whois-json" {
  interface WhoisResult {
    registrar?: string;
    domainName?: string;
    creationDate?: string;
    expirationDate?: string;
    status?: string[];
    text?: string;
    "Registry Domain ID"?: string;
  }

  export default function whois(domain: string): Promise<WhoisResult>;
}
