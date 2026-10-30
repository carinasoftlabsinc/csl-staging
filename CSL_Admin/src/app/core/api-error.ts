/**
 * An API error that the interceptors have already shown to the user (and logged if needed).
 * The global error handler skips these so the same problem is not reported twice.
 */
export class ApiError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'ApiError';
  }
}
