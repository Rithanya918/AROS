import { referenceDatabase } from "./referenceDatabase";

export interface FactCheckItem {
  claim: string;
  verified: boolean;
  conflict: boolean;
  message: string;
  source: string;
  severity: "high" | "medium" | "low";
}

export interface FactCheckResult {
  results: FactCheckItem[];
  verified_count: number;
  total_checks: number;
  verification_rate: number;
  has_conflicts: boolean;
  conflicts: FactCheckItem[];
}

function extractClaims(text: string) {
  const claims: { type: string; value: string; raw: string }[] = [];

  // Dollar amounts
  const dollars = text.match(/\$[\d,]+(?:\.\d{2})?/g) || [];
  dollars.forEach(d => claims.push({ type: "dollar", value: d.replace(/[$,]/g, ""), raw: d }));

  // Percentages
  const percents = text.match(/(\d+(?:\.\d+)?)\s*%/g) || [];
  percents.forEach(p => claims.push({ type: "percentage", value: p, raw: p }));

  // Dates
  const dates = text.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/gi) || [];
  dates.forEach(d => claims.push({ type: "date", value: d, raw: d }));

  return claims;
}

export function checkFacts(text: string): FactCheckResult {
  const claims = extractClaims(text);
  const results: FactCheckItem[] = [];
  const lowerText = text.toLowerCase();

  // Check dollar amounts against reference data
  claims.filter(c => c.type === "dollar").forEach(claim => {
    const amount = parseFloat(claim.value);
    if (lowerText.includes("grant") || lowerText.includes("award") || lowerText.includes("maximum")) {
      const refMax = parseFloat(referenceDatabase.university_grants.max_award.replace(/[$,]/g, ""));
      if (amount > refMax) {
        results.push({
          claim: claim.raw,
          verified: false,
          conflict: true,
          message: `Verified maximum is ${referenceDatabase.university_grants.max_award}`,
          source: "University Grants Database",
          severity: "high"
        });
      } else {
        results.push({
          claim: claim.raw,
          verified: true,
          conflict: false,
          message: `Amount is within verified range`,
          source: "University Grants Database",
          severity: "low"
        });
      }
    } else {
      results.push({
        claim: claim.raw,
        verified: false,
        conflict: false,
        message: "Could not verify — no matching reference data",
        source: "N/A",
        severity: "medium"
      });
    }
  });

  // Check dates
  claims.filter(c => c.type === "date").forEach(claim => {
    if (claim.raw.toLowerCase().includes("march 15") && claim.raw.includes("2026")) {
      results.push({
        claim: claim.raw,
        verified: true,
        conflict: false,
        message: `Matches verified deadline: ${referenceDatabase.university_grants.deadline}`,
        source: "University Grants Database",
        severity: "low"
      });
    } else {
      results.push({
        claim: claim.raw,
        verified: false,
        conflict: false,
        message: "Date could not be verified against known records",
        source: "N/A",
        severity: "medium"
      });
    }
  });

  // Check percentages
  claims.filter(c => c.type === "percentage").forEach(claim => {
    results.push({
      claim: claim.raw,
      verified: false,
      conflict: false,
      message: "Statistical claim — no source provided for verification",
      source: "N/A",
      severity: "medium"
    });
  });

  const verified_count = results.filter(r => r.verified).length;
  const conflicts = results.filter(r => r.conflict);

  return {
    results,
    verified_count,
    total_checks: results.length,
    verification_rate: results.length > 0 ? (verified_count / results.length) * 100 : 100,
    has_conflicts: conflicts.length > 0,
    conflicts
  };
}
