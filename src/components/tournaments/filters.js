/**
 * @param {string} eligibility
 * @param {number} dots
 * @param {string[]} selectedEligibility
 * @param {number[]} selectedDifficulties
 */
export function matchesTournamentFilters(
  eligibility,
  dots,
  selectedEligibility,
  selectedDifficulties,
) {
  return (
    selectedEligibility.includes(eligibility) &&
    selectedDifficulties.some(
      (level) => level === Math.floor(dots) || level === Math.ceil(dots),
    )
  );
}
