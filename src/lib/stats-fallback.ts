import { FOUNDING_YEAR, SiteStatistics } from "@/lib/stats-db";

export function getFallbackSiteStatistics(): SiteStatistics {
  const currentYear = new Date().getFullYear();

  return {
    professionalMembers: 0,
    trainingPrograms: 0,
    communityEvents: 0,
    yearsOfDevelopment: Math.max(currentYear - FOUNDING_YEAR, 1),
  };
}
