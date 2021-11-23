import path from "path";
import simpleGit, { SimpleGit } from "simple-git";

export async function getModifiedSqlFiles(
  sourcePath: string,
  diffBase: string
) {
  const git: SimpleGit = simpleGit(sourcePath);
  const root = await git.revparse("--show-toplevel");
  const modifiedFiles = new Set<string>();

  const diffSummary = await git.diffSummary(diffBase);

  diffSummary.files
    .map((f) => f.file)
    .filter((f) => f.toLowerCase().endsWith(".sql"))
    .forEach((f) => modifiedFiles.add(f));

  const status = await git.status();
  status.not_added
    .filter((f) => f.toLowerCase().endsWith(".sql"))
    .forEach((f) => modifiedFiles.add(f));

  // Filter out hasura migrations that may be included.
  return Array.from(modifiedFiles)
    .filter((subpath) => !subpath.includes("migrations/"))
    .map((subpath) => path.join(root, subpath));
}

export async function getMigrationFiles(hasuraDir: string, diffBase: string) {
  const git: SimpleGit = simpleGit(hasuraDir);
  const root = await git.revparse("--show-toplevel");
  const modifiedFiles = new Set<string>();

  const diffSummary = await git.diffSummary(diffBase);

  diffSummary.files
    .map((f) => f.file)
    .filter((f) => f.endsWith("/up.sql"))
    .forEach((f) => modifiedFiles.add(f));

  const status = await git.status();
  status.not_added
    .filter((f) => f.endsWith("/up.sql"))
    .forEach((f) => modifiedFiles.add(f));

  // Filter for only hasura migrations.
  return Array.from(modifiedFiles)
    .filter((subpath) => subpath.includes("migrations/"))
    .map((subpath) => path.join(root, subpath));
}
