import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

export function getLastUpdated(sourceFiles: string[]): Date;
export function getLastUpdated(
  sourceFiles: string[],
  development: boolean,
): Date | null;
export function getLastUpdated(sourceFiles: string[], development = false) {
  if (
    execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
      encoding: "utf8",
    }).trim() === "true"
  ) {
    throw new Error(
      "Page timestamps need full Git history. Run git fetch --unshallow.",
    );
  }
  const pageTimestamp = execFileSync(
    "git",
    ["log", "-1", "--format=%cI", "--", sourceFiles[0]],
    { encoding: "utf8" },
  ).trim();
  if (!pageTimestamp) {
    if (development && sourceFiles.every((file) => existsSync(file)))
      return null;
    throw new Error(`No Git history found for ${sourceFiles[0]}`);
  }
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
