import { SiteStatistics } from "@/lib/stats-db";

export function getFallbackSiteStatistics(): SiteStatistics {
  return {
    barbers: 0,
    barbershopOwners: 0,
  };
}
