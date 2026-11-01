export function matchesTournamentFilters(
  eligibility: string,
  dots: number,
  selectedEligibility: string[],
  selectedDifficulties: number[],
) {
  return (
    selectedEligibility.includes(eligibility) &&
    selectedDifficulties.some(
      (level) => level === Math.floor(dots) || level === Math.ceil(dots),
    )
  );
}
