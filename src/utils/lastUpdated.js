import { execFileSync } from "node:child_process";

/** @param {string[]} sourceFiles */
export function getLastUpdated(sourceFiles) {
  const timestamp = execFileSync(
    "git",
    ["log", "-1", "--format=%cI", "--", ...sourceFiles],
    { encoding: "utf8" },
  ).trim();
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`No Git history found for ${sourceFiles.join(", ")}`);
  }
  return date;
}
