import nextCoreWebVitals from "eslint-config-next/core-web-vitals"

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...nextCoreWebVitals,
  {
    rules: {
      // Flat-config ESLint replaces the removed `next lint` CLI; these React Compiler
      // rules were never enforced while `next lint` was broken on Next.js 16.4.x.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react/no-unescaped-entities": "warn",
    },
  },
]

export default eslintConfig
