/**
 * Resolves once `element` is within `rootMargin` of the viewport.
 *
 * Used to load a heavy library (GSAP, Keen Slider) just before its section scrolls into view instead
 * of at page start. The default margin is large on purpose: the library is ready before the visitor
 * reaches the section, so any layout it adds (pin spacers, slider widths) happens off screen.
 *
 * Browser only. If IntersectionObserver is missing it resolves at once, so the feature still works.
 * An abort (for example when the component is destroyed) stops observing and the promise never resolves.
 */
export function whenNearViewport(element: Element, rootMargin = '1200px', signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (typeof IntersectionObserver === 'undefined') {
      resolve();
      return;
    }
    if (signal?.aborted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          resolve();
        }
      },
      { rootMargin }
    );
    observer.observe(element);
    signal?.addEventListener('abort', () => observer.disconnect(), { once: true });
  });
}
