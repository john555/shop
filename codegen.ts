import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "./types/api.schema.gql",
    generates: {
      "./types/api.ts": {
        plugins: ["typescript", "typescript-resolvers"],
      },
    },
  };

export default config;