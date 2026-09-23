import js from "@eslint/js";
import tseslint from "typescript-eslint";

/** Shared flat config for plain TS packages. Apps layer their framework config on top. */
export default tseslint.config(
  { ignores: ["dist/**", "coverage/**", "**/*.d.ts"] },
  js.configs.recommended,
  ...tseslint.configs.strict,
);
