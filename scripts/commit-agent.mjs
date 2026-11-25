import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { spawnSync } from "node:child_process";

const minimumChangedLines = 1000;

function runGit(args) {
  const result = spawnSync("git", args, { encoding: "utf8" });

  if (result.error) {
    throw new Error(`Could not run git: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git ${args.join(" ")} failed`);
  }

  return result.stdout;
}

function parseNumstat(output) {
  return output
    .split("\0")
    .filter(Boolean)
    .reduce((total, entry) => {
      const firstTab = entry.indexOf("\t");
      const secondTab = entry.indexOf("\t", firstTab + 1);
      if (firstTab < 0 || secondTab < 0) {
        return total;
      }

      const additions = Number(entry.slice(0, firstTab));
      const deletions = Number(entry.slice(firstTab + 1, secondTab));
      return total + (Number.isFinite(additions) ? additions : 0) +
        (Number.isFinite(deletions) ? deletions : 0);
    }, 0);
}

function getScope(path) {
  const parts = path.split("/");
  if (parts[0] === "src" && parts[1]) {
    return parts[1].replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
  if (parts.length > 1) {
    return parts[0].replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
  return parts[0].replace(/\.[^.]+$/, "").toLowerCase();
}

function createCommitMessage(files, changedLines) {
  const scopes = [...new Set(files.map(getScope))].sort();
  const scopeText = scopes.length > 3
    ? `${scopes.slice(0, 3).join(", ")}, and more`
    : scopes.length > 1
      ? `${scopes.slice(0, -1).join(", ")} and ${scopes.at(-1)}`
      : scopes[0] ?? "project";

  const title = `chore: update ${scopeText}`;
  const fileList = files.map((file) => `- ${file}`).join("\n");
  return `${title}\n\n${changedLines} staged lines changed across ${files.length} file${files.length === 1 ? "" : "s"}.\n\n${fileList}`;
}

async function main() {
  const numstat = runGit(["diff", "--cached", "--numstat", "-z"]);
  const files = runGit(["diff", "--cached", "--name-only", "-z"])
    .split("\0")
    .filter(Boolean);

  if (files.length === 0) {
    throw new Error("Nothing is staged. Stage the changes you want to commit first.");
  }

  const changedLines = parseNumstat(numstat);
  if (changedLines < minimumChangedLines) {
    throw new Error(
      `The staged diff has ${changedLines} changed lines; at least ${minimumChangedLines} are required.`
    );
  }

  const message = createCommitMessage(files, changedLines);
  stdout.write(`Commit message preview:\n\n${message}\n\n`);

  const terminal = createInterface({ input: stdin, output: stdout });
  try {
    const answer = await terminal.question("Create this commit? [y/N] ");
    if (!/^y(es)?$/i.test(answer.trim())) {
      stdout.write("Commit cancelled; the index and working tree were left unchanged.\n");
      return;
    }
  } finally {
    terminal.close();
  }

  runGit(["commit", "-m", message]);
}

main().catch((error) => {
  console.error(`Commit agent: ${error.message}`);
  process.exitCode = 1;
});
