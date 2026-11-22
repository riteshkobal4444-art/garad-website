/**
 * Indian Financial Year (April–March) utilities for Garad Foundation's Activity Archive.
 *
 * Rule:
 * - Months April through December (month index 3–11) belong to FY `YYYY–(YYYY+1)`.
 * - Months January through March (month index 0–2) belong to FY `(YYYY-1)–YYYY`.
 */

export type ConcreteFinancialYearId =
  | '2018-2019'
  | '2019-2020'
  | '2020-2021'
  | '2021-2022'
  | '2022-2023'
  | '2023-2024'
  | '2024-2025'
  | '2025-2026';

export type FinancialYearId = 'all' | ConcreteFinancialYearId;

/**
 * Standard financial-year filter horizon required across the archive (2019–2020 through 2025–2026).
 * Earlier populated financial years (such as 2018–2019 for Feb/Mar 2019 activities) are
 * automatically included whenever matching records exist.
 */
export const REQUIRED_FINANCIAL_YEARS: readonly ConcreteFinancialYearId[] = [
  '2019-2020',
  '2020-2021',
  '2021-2022',
  '2022-2023',
  '2023-2024',
  '2024-2025',
  '2025-2026',
] as const;

const KNOWN_FINANCIAL_YEARS = new Set<string>([
  '2018-2019',
  ...REQUIRED_FINANCIAL_YEARS,
]);

const MONTH_INDEX_BY_NAME: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

function toConcreteFinancialYear(
  startYear: number,
  fallbackYear?: ConcreteFinancialYearId
): ConcreteFinancialYearId {
  const candidate = `${startYear}-${startYear + 1}`;
  if (KNOWN_FINANCIAL_YEARS.has(candidate)) {
    return candidate as ConcreteFinancialYearId;
  }
  if (fallbackYear) {
    return fallbackYear;
  }
  throw new Error(
    `Calculated financial year "${candidate}" is outside the configured archive range.`
  );
}

/**
 * Calculates the Indian Financial Year (April–March) from a Date object or
 * human-readable archival date string.
 *
 * Examples:
 * - "19 February 2019" -> "2018-2019"
 * - "20 March 2019"    -> "2018-2019"
 * - "28 April 2019"    -> "2019-2020"
 * - "1 January 2020"   -> "2019-2020"
 * - "15 October 2021"  -> "2021-2022"
 * - "20 February 2022" -> "2021-2022"
 * - "21 June 2022"     -> "2022-2023"
 * - "27 August 2023"   -> "2023-2024"
 * - "19 February 2024" -> "2023-2024"
 */
export function calculateFinancialYear(
  dateInput: Date | string,
  fallbackYear?: ConcreteFinancialYearId
): ConcreteFinancialYearId {
  if (dateInput instanceof Date && !Number.isNaN(dateInput.getTime())) {
    const year = dateInput.getFullYear();
    const monthIndex = dateInput.getMonth(); // 0 = Jan, 3 = Apr
    const startYear = monthIndex >= 3 ? year : year - 1;
    return toConcreteFinancialYear(startYear, fallbackYear);
  }

  const raw = String(dateInput || '').trim();
  if (!raw) {
    if (fallbackYear) return fallbackYear;
    throw new Error('Cannot calculate financial year from an empty date.');
  }

  // 1. Explicit ISO date: YYYY-MM-DD
  const isoMatch = raw.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const monthIndex = Number(isoMatch[2]) - 1;
    const startYear = monthIndex >= 3 ? year : year - 1;
    return toConcreteFinancialYear(startYear, fallbackYear);
  }

  // 2. Human-readable date with month name + 4-digit year (e.g. "20 March 2019", "April 2019")
  const monthYearMatch = raw.match(
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b[^0-9]{0,12}\b(20\d{2})\b/i
  );
  if (monthYearMatch) {
    const monthKey = monthYearMatch[1].toLowerCase();
    const monthIndex = MONTH_INDEX_BY_NAME[monthKey];
    const year = Number(monthYearMatch[2]);
    if (monthIndex !== undefined) {
      const startYear = monthIndex >= 3 ? year : year - 1;
      return toConcreteFinancialYear(startYear, fallbackYear);
    }
  }

  // 3. Explicit Financial / Academic Year range (e.g. "Academic Year 2020–21" or "2020-2021")
  const fyRangeMatch = raw.match(/\b(20\d{2})\s*[–-]\s*(\d{2}|\d{4})\b/);
  if (fyRangeMatch) {
    const startYear = Number(fyRangeMatch[1]);
    return toConcreteFinancialYear(startYear, fallbackYear);
  }

  // 4. Year-only string (e.g. "2019")
  const yearOnlyMatch = raw.match(/^\s*(20\d{2})\s*$/);
  if (yearOnlyMatch) {
    if (fallbackYear) return fallbackYear;
    const startYear = Number(yearOnlyMatch[1]);
    return toConcreteFinancialYear(startYear);
  }

  // 5. Fallback for undated archival records (e.g. "27 February (Exact year not specified)")
  if (fallbackYear) {
    return fallbackYear;
  }

  throw new Error(
    `Unable to derive Indian financial year from date string "${raw}".`
  );
}

/**
 * Formats a concrete financial-year ID into its full display label using an en-dash.
 * Example: "2019-2020" -> "2019–2020"
 */
export function formatFinancialYearLabel(fy: ConcreteFinancialYearId): string {
  return fy.replace('-', '–');
}

/**
 * Formats a concrete financial-year ID into a compact pillar axis label.
 * Example: "2019-2020" -> "19–20"
 */
export function formatFinancialYearShort(fy: ConcreteFinancialYearId): string {
  const [start, end] = fy.split('-');
  return `${start.slice(2)}–${end.slice(2)}`;
}

/**
 * Parses the numeric start year of a concrete financial year (e.g. "2018-2019" -> 2018).
 */
export function getFinancialYearStart(fy: ConcreteFinancialYearId): number {
  return Number(fy.split('-')[0]);
}

/**
 * Builds the deduplicated, chronologically ordered financial-year filter list:
 * - Always starts with "All Activities"
 * - Always includes all seven required financial years (2019–2020 through 2025–2026)
 * - Automatically includes any earlier populated financial year (e.g. 2018–2019)
 *   so historical activities are never hidden or misclassified.
 */
export function buildFinancialYearFilters(
  populatedYears: readonly ConcreteFinancialYearId[]
): { id: FinancialYearId; label: string }[] {
  const uniqueYears = Array.from(
    new Set<ConcreteFinancialYearId>([
      ...populatedYears,
      ...REQUIRED_FINANCIAL_YEARS,
    ])
  ).sort((a, b) => getFinancialYearStart(a) - getFinancialYearStart(b));

  return [
    { id: 'all', label: 'All Activities' },
    ...uniqueYears.map((fy) => ({
      id: fy,
      label: formatFinancialYearLabel(fy),
    })),
  ];
}
