import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://finance-api-jkexq.ondigitalocean.app/graphql",
  overwrite: true,
  documents: [
    "./src/graphql/queries/*.graphql",
    "./src/graphql/mutations/*.graphql",
    "./src/graphql/subscriptions/*.graphql",
  ],
  generates: {
    "src/graphql/generated/graphql.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
        {
          add: {
            content: `// @ts-nocheck`,
          },
        },
      ],
      config: {
        withHooks: true,
        exposeQueryKeys: true,
        exposeMutationKeys: true,
        exposeFetcher: true,
        fetcher: "@/lib/query-fetcher#fetcherWithGraphQLClient",
        reactQueryVersion: 5,
      },
    },
    "schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;
