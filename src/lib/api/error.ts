import { ZodIssue } from 'zod';

/**
 * Transforms Zod validation issues into a field-error map for react-hook-form.
 * Each field path becomes a key with its error message as the value.
 */
export function zodIssuesToFieldErrors(issues: ZodIssue[]): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of issues) {
    const fieldPath = issue.path.join('.');
    if (!errors[fieldPath]) {
      errors[fieldPath] = issue.message;
    }
  }

  return errors;
}

/**
 * Custom error class for API validation errors.
 * Allows distinction between validation errors and generic network/server errors.
 */
export class ValidationError extends Error {
  constructor(public fieldErrors: Record<string, string>) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}
