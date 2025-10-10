export function isAtLeast16(dob, asOf = new Date()) {
  // Accept Date or string
  const d = (dob instanceof Date) ? dob : new Date(dob);

  // Normalize both sides to UTC midnight (treat DOB as a date-only field)
  const dobUTC = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

  const cutoff = new Date(Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), asOf.getUTCDate()));
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - 16);

  return dobUTC <= cutoff;
}