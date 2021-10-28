import * as child from "child_process";
import { file, withFile } from "tmp-promise";
import { promises as fs } from "fs";
import path from "path";
import chalk from "chalk";

class ExecError extends Error {
  stdout?: string;
  stderr?: string;
  innerError?: Error;
}

function exec(
  command: string,
  options = { cwd: process.cwd() }
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((done, failed) => {
    child.exec(command, { ...options }, (err, stdout, stderr) => {
      if (err) {
        const e = new ExecError();
        e.stdout = stdout;
        e.stderr = stderr;
        e.innerError = err;
        e.message = `Command failed and exited with code ${err.code}`;
        failed(e);
        return;
      }

      done({ stdout, stderr });
    });
  });
}

interface CreateHasuraMigrationArgs {
  name: string;
  files: string[];
  hasuraDatabaseName: string;
  hasuraDir: string;
  dryRun: boolean;
  log: (message?: any, ...optionalParams: any[]) => void;
}
export async function createHasuraMigration({
  name,
  files,
  hasuraDatabaseName,
  hasuraDir,
  dryRun,
  log,
}: CreateHasuraMigrationArgs) {
  withFile(
    async ({ path: concatenatedSqlFilePath }) => {
      const concatenateOut = await fs.open(concatenatedSqlFilePath, "w");
      for (const filePath of files) {
        const contents = await fs.readFile(filePath);
        await concatenateOut.writeFile(`-- ${path.basename(filePath)}\n`);
        await concatenateOut.writeFile(contents);
        await concatenateOut.writeFile("\n\n");
      }
      await concatenateOut.close();

      const cmd = [
        "hasura",
        "migrate",
        "create",
        name,
        "--sql-from-file",
        concatenatedSqlFilePath,
        "--database-name",
        hasuraDatabaseName,
      ];

      log(
        chalk.green("->"),
        `Concatenated modified files into ${concatenatedSqlFilePath}`
      );

      const cmdString = cmd.join(" ");
      if (dryRun) {
        log(
          chalk.green("->"),
          "Running in dry run mode. Would execute this command:"
        );
        log(" $", cmdString);
      } else {
        log(chalk.green("->"), "Running hasura command:");
        log(" $", cmdString);
        const { stdout, stderr } = await exec(cmdString, {
          cwd: hasuraDir,
        });
        log(chalk.green("->"), "hasura migrate completed with output:");
        log(stdout);
        log(stderr);
      }
    },
    {
      prefix: "sql-",
      postfix: ".sql",
    }
  );
}
