import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

/** Messages shared between open admin tabs. */
export type SessionMessage =
  | { type: 'logout'; reason: 'user' | 'expired' }
  | { type: 'login' };

const CHANNEL_NAME = 'csl-admin-auth';

/**
 * Lets open admin tabs tell each other about a login or logout (Broadcast Channel API),
 * so every tab follows at once. A tab never receives its own messages.
 * In browsers without Broadcast Channel this does nothing.
 */
@Injectable({ providedIn: 'root' })
export class SessionSyncService {
  private readonly channel: BroadcastChannel | null =
    typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL_NAME) : null;

  /** Messages sent by other tabs. */
  readonly messages$ = new Subject<SessionMessage>();

  constructor(private ngZone: NgZone) {
    if (this.channel) {
      this.channel.onmessage = (event: MessageEvent) => {
        const message = this.parse(event.data);
        if (message) {
          // Run inside Angular so routing and messages update the page.
          this.ngZone.run(() => this.messages$.next(message));
        }
      };
    }
  }

  /** Tells the other open tabs about a login or logout. */
  announce(message: SessionMessage): void {
    this.channel?.postMessage(message);
  }

  private parse(data: unknown): SessionMessage | null {
    const message = data as Partial<SessionMessage> | null;
    if (message?.type === 'login') {
      return { type: 'login' };
    }
    if (message?.type === 'logout') {
      const reason = (message as { reason?: unknown }).reason === 'expired' ? 'expired' : 'user';
      return { type: 'logout', reason };
    }
    return null;
  }
}
