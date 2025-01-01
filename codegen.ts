import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "./lib/common/types/admin-api.schema.gql",
    generates: {
      "./lib/common/types/admin-api.ts": {
        plugins: ["typescript", "typescript-resolvers"],
      },
    },
  };

export default config;