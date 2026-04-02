export interface DomainItem {
  id: string;
  domain: string;
  expiresAt: string;
  notes?: string;
}

export interface PublicDomainCheckResponse {
  domain: string;
  available: boolean;
  status: "subscribed" | "expired" | "not_found";
  subscribed: boolean;
  expired: boolean;
  expiresAt: string | null;
}
