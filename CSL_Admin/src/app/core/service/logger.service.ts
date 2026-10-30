/* eslint-disable no-console -- the logger is the one place allowed to write to the console */
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

const PREFIX = '[CSL Admin]';

/**
 * All error output goes through here.
 * - Development (`npm start`, `npm run start:live`): the message plus the full details, to help fix the problem.
 * - Production (the deployed admin): one short line only, no objects, response bodies or personal data.
 * Nothing is printed unless an error actually happens.
 */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  error(message: string, details?: unknown): void {
    if (environment.production || details === undefined) {
      console.error(`${PREFIX} ${message}`);
    } else {
      console.error(`${PREFIX} ${message}`, details);
    }
  }

  /** Development only; prints nothing in production. */
  debug(message: string, details?: unknown): void {
    if (environment.production) {
      return;
    }
    if (details === undefined) {
      console.debug(`${PREFIX} ${message}`);
    } else {
      console.debug(`${PREFIX} ${message}`, details);
    }
  }
}
