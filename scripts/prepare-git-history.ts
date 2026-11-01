import { execFileSync } from "node:child_process";

if (
  execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
    encoding: "utf8",
  }).trim() === "true"
) {
  execFileSync("git", ["fetch", "--unshallow"], { stdio: "inherit" });
}
