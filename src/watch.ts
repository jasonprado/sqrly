import chalk from "chalk";
import chokidar from "chokidar";
import path from "path";

interface WatchArgs {
  sourcePath: string;
  fileChanged: (path: string) => void;
  log: (message?: any, ...optionalParams: any[]) => void;
}

export function watchPath({ sourcePath, fileChanged, log }: WatchArgs) {
  const sqlGlob = path.join(sourcePath, "**", "*.sql");
  log(chalk.green("->"), `Monitoring changes to ${sqlGlob}`);
  const watcher = chokidar.watch(sqlGlob, {
    ignoreInitial: true,
  });
  watcher.on("change", (path: string) => {
    fileChanged(path);
  });
  watcher.on("add", (path: string) => {
    fileChanged(path);
  });
}
