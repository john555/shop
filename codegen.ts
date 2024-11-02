import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "./lib/common/types/api.schema.gql",
    generates: {
      "./lib/common/types/api.ts": {
        plugins: ["typescript", "typescript-resolvers"],
      },
    },
  };

export default config;