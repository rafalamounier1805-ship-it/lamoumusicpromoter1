import { mkdir, writeFile } from "node:fs/promises";

import { runCoreCubeBenchmark } from "../src/lib/lamou/core-cube-experiment";

const report = runCoreCubeBenchmark(250);
const outputDir = "artifacts";
const outputPath = `${outputDir}/core-cube-benchmark.json`;

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(
  `CORE Cubo benchmark: ${report.results.length} arquiteturas, ${report.tasks} tarefas, ${report.records} registros`,
);
for (const result of report.results) {
  console.log(
    [
      result.architecture,
      `latency=${result.latencyMs}ms`,
      `accuracy=${result.retrievalAccuracy}`,
      `taskSuccess=${result.taskSuccessRate}`,
      `index=${result.indexBytes}B`,
      `context=${result.contextBytes}B`,
      `tenantIsolation=${result.tenantIsolation}`,
    ].join(" | "),
  );
}
console.log(`CORE_CUBE_BENCHMARK_JSON=${JSON.stringify(report)}`);
