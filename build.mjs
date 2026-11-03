import { build } from "esbuild";
import { writeFile } from "node:fs/promises";
await build({
  entryPoints: ["src/host.js"], bundle: true, format: "esm", platform: "node", target: "node22",
  external: ["@deepseek-ai/schemastery", "@deepseek-ai/dsh-typert-protocol"], outfile: "index.js",
});
const result = await build({
  entryPoints: ["src/client.jsx"],
  bundle: true,
  write: false,
  format: "cjs",
  target: "chrome130",
  external: ["react", "react-dom"],
  loader: { ".css": "text" },
  legalComments: "none",
});
await writeFile(
  "client.js",
  `window.__ModuleLoader__.load({id:'@local/dsh-model-assistant',factory(require){const module={exports:{}};const exports=module.exports;\n${result.outputFiles[0].text}\nreturn module.exports;}});\n`,
);
