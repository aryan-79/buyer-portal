import 'dotenv/config';
import { defineConfig } from '@openapi-codegen/cli';
import { generateReactQueryComponents, generateSchemaTypes } from '@openapi-codegen/typescript';

export default defineConfig({
  example: {
    from: {
      source: 'url',
      url: process.env.OPENAPI_SOURCE as string,
    },

    outputDir: 'src/lib/queries',

    to: async (context) => {
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenameCase: 'kebab',
        filenamePrefix: 'query',
      });

      await generateReactQueryComponents(context, {
        filenameCase: 'kebab',
        filenamePrefix: 'query',
        schemasFiles,
      });
    },
  },
});
