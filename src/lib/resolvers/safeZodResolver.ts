import { ZodSchema } from 'zod';
import { FieldValues, Resolver } from 'react-hook-form';

/**
 * Safe resolver wrapper for Zod validation that prevents uncaught errors.
 * Ensures any Zod validation error is caught and converted to react-hook-form's
 * error format, preventing unhandled promise rejections.
 */
export function safeZodResolver<T extends FieldValues>(schema: ZodSchema): Resolver<T> {
  return (async (values) => {
    try {
      const data = await schema.parseAsync(values);
      return { values: data as T, errors: {} };
    } catch (error: any) {
      const errors: Record<string, any> = {};

      if (error?.issues && Array.isArray(error.issues)) {
        for (const issue of error.issues) {
          const path = issue.path.join('.');
          if (!errors[path]) {
            errors[path] = { type: 'manual', message: issue.message };
          }
        }
      } else if (error?.message) {
        errors['root'] = { type: 'manual', message: error.message };
      }

      return { values: {}, errors };
    }
  }) as Resolver<T>;
}
