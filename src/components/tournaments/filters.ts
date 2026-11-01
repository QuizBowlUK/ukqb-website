export function matchesTournamentFilters(
  eligibility: string,
  dots: number,
  popCulture: boolean,
  selectedEligibility: string[],
  selectedDifficulties: string[],
) {
  return (
    selectedEligibility.includes(eligibility) &&
    ((popCulture && selectedDifficulties.includes("pop-culture")) ||
      (dots > 0 &&
        (selectedDifficulties.includes(String(Math.floor(dots))) ||
          selectedDifficulties.includes(String(Math.ceil(dots))))))
  );
}
