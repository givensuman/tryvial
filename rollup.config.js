import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "index.ts",
  output: [{
    dir: "dist",
    format: "cjs"
  },
  {
    dir: "dist",
    format: "es"
  }],
  plugins: [typescript(), terser()],
};