import { spawnSync } from "node:child_process";

// Use the installed Bun executable so the repository test gate is retained.
const result = spawnSync(process.execPath, ["run", "build"], {
  stdio: "inherit",
  env: { ...process.env, NITRO_PRESET: "node-server" },
});
process.exit(result.status ?? 1);
