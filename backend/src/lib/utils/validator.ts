import type { ValidationTargets } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { validator as standardValidator } from 'hono-openapi';
import type { ZodType } from 'zod';

export const validator = <T extends ZodType>(target: keyof ValidationTargets, schema: T) => {
  return standardValidator(target, schema, (result) => {
    if (!result.success) {
      const issues = result.error;
      console.error(issues);

      const firstIssue = issues.at(0);

      const errorMessage = firstIssue
        ? `Error in '${String(firstIssue.path?.at(0))}': ${firstIssue.message}`
        : 'The provided input data is invalid.';

      throw new HTTPException(400, {
        message: errorMessage,
      });
    }
  });
};
