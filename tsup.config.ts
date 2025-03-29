import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts"],
  outDir: "dist",
  target: "node18",
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: false,
  esbuildOptions(options) {
    options.drop = ["console"];
  },
});
