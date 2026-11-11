import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Admin pages check the session themselves: the panel layout doesn't, so that
// navigation can show loading.tsx at once. This rule fails the lint if a page's
// first statement isn't `await requireUser()` (on its own or assigned to a
// variable).
const GUARDS = new Set(["requireUser"]);

function guardCall(stmt) {
  const expr =
    stmt?.type === "ExpressionStatement"
      ? stmt.expression
      : stmt?.type === "VariableDeclaration" && stmt.declarations.length === 1
        ? stmt.declarations[0].init
        : null;
  return expr?.type === "AwaitExpression" && expr.argument.type === "CallExpression" && expr.argument.callee.type === "Identifier" && GUARDS.has(expr.argument.callee.name);
}

const adminGuard = {
  rules: {
    "page-checks-session": {
      meta: { type: "problem", schema: [] },
      create(context) {
        return {
          ExportDefaultDeclaration(node) {
            const fn = node.declaration;
            const first = fn.type === "FunctionDeclaration" ? fn.body.body[0] : null;
            if (!guardCall(first)) {
              context.report({ node, message: "Admin pages must start with `await requireUser()`; the panel layout doesn't check the session." });
            }
          },
        };
      },
    },
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/app/admin/(panel)/**/page.tsx"],
    plugins: { "admin-guard": adminGuard },
    rules: { "admin-guard/page-checks-session": "error" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
