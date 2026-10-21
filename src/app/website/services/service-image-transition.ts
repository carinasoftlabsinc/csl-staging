export interface ServiceImageTransition {
  setProgress(position: number): void;
  destroy(): void;
}

/** A scroll-scrubbed reveal: the same position produces the same image in either direction. */
export async function createServiceImageTransition(
  stage: HTMLElement,
  signal?: AbortSignal,
): Promise<ServiceImageTransition> {
  const layers = Array.from(stage.querySelectorAll<HTMLElement>('.service-image-layer'));
  const images = layers.map(layer => layer.querySelector<HTMLImageElement>('img')!);
  if (signal?.aborted || !layers.length) throw new Error('Image transition cancelled');

  // Decode before revealing a layer so fast scrolling cannot show an empty image.
  await Promise.all(images.map(image => image.decode()));
  if (signal?.aborted) throw new Error('Image transition cancelled');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let position = 0;
  let radius = 0;
  let destroyed = false;
  let previousBase = -1;
  let previousNext = -1;

  const resetLayer = (index: number) => {
    if (index < 0) return;
    const layer = layers[index];
    layer.classList.remove('is-active', 'is-revealing');
    layer.style.removeProperty('clip-path');
    layer.style.removeProperty('z-index');
    layer.setAttribute('aria-hidden', 'true');
    images[index].style.removeProperty('transform');
  };

  const render = () => {
    if (destroyed) return;
    const base = Math.floor(position);
    const next = Math.min(base + 1, layers.length - 1);
    // Hold each photograph; reveal during the middle 60% of the next service's approach.
    const raw = Math.min(1, Math.max(0, (position - base - 0.2) / 0.6));
    const progress = reducedMotion.matches ? (raw >= 0.5 ? 1 : 0) : raw * raw * (3 - 2 * raw);

    if (base !== previousBase || next !== previousNext) {
      resetLayer(previousBase);
      resetLayer(previousNext);
      layers[base].classList.add('is-active');
      layers[base].style.zIndex = '1';
      if (next !== base) {
        layers[next].classList.add('is-active');
        layers[next].style.zIndex = '2';
      }
      previousBase = base;
      previousNext = next;
    }

    const visibleIndex = progress >= 0.5 ? next : base;
    layers[base].setAttribute('aria-hidden', String(visibleIndex !== base));
    layers[next].setAttribute('aria-hidden', String(visibleIndex !== next));
    if (next === base) return;

    // Centre on the bottom edge, so the visible reveal begins as a true semicircle.
    layers[next].style.clipPath = progress >= 1
      ? 'none'
      : `circle(${(radius * progress).toFixed(3)}px at 50% 100%)`;
    layers[next].classList.toggle('is-revealing', progress > 0 && progress < 1);
    images[next].style.transform = reducedMotion.matches
      ? 'none'
      : `translate3d(0, ${(1 - progress) * 1.5}%, 0) scale(${1 + (1 - progress) * 0.045})`;
  };

  const resize = () => {
    // Measure only on resize, never inside the scroll animation's hot path.
    const { width, height } = stage.getBoundingClientRect();
    radius = Math.hypot(width / 2, height) + 1;
    render();
  };
  const observer = new ResizeObserver(resize);

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    observer.disconnect();
    reducedMotion.removeEventListener('change', render);
    signal?.removeEventListener('abort', destroy);
    layers.forEach((_, index) => resetLayer(index));
    layers[0].classList.add('is-active');
    layers[0].setAttribute('aria-hidden', 'false');
  };

  resize();
  observer.observe(stage);
  reducedMotion.addEventListener('change', render);
  signal?.addEventListener('abort', destroy, { once: true });

  return {
    setProgress(value: number): void {
      if (!Number.isFinite(value)) return;
      position = Math.min(layers.length - 1, Math.max(0, value));
      render();
    },
    destroy,
  };
}
