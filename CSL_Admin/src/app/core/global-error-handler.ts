import { ErrorHandler, Injectable } from '@angular/core';
import { ApiError } from './api-error';
import { LoggerService } from './service/logger.service';

const MAX_SUMMARY = 150;

/** Catches errors nobody else handled (a page crashing) and reports them through the logger. */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private logger: LoggerService) {}

  handleError(error: unknown): void {
    // Promise errors arrive wrapped: { rejection: <the real error> }.
    const actual = (error as { rejection?: unknown })?.rejection ?? error;
    if (actual instanceof ApiError) {
      return; // already shown to the user by the interceptors
    }
    const summary =
      actual instanceof Error ? `${actual.name}: ${actual.message}` : String(actual);
    this.logger.error(`Unexpected error: ${summary.slice(0, MAX_SUMMARY)}`, actual);
  }
}
