import { createServiceImageTransition, ServiceImageTransition } from './service-image-transition';

describe('Service image scroll reveal', () => {
  let stage: HTMLElement;
  let transition: ServiceImageTransition;
  let motion: MediaQueryList;

  beforeEach(async () => {
    motion = {
      matches: false,
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
    } as unknown as MediaQueryList;
    spyOn(window, 'matchMedia').and.returnValue(motion);
    stage = document.createElement('div');
    spyOn(stage, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 0, 400, 600));
    for (let index = 0; index < 5; index++) {
      const layer = document.createElement('div');
      layer.className = 'service-image-layer';
      layer.setAttribute('aria-hidden', String(index !== 0));
      const image = document.createElement('img');
      spyOn(image, 'decode').and.resolveTo();
      layer.appendChild(image);
      stage.appendChild(layer);
    }
    transition = await createServiceImageTransition(stage);
  });

  afterEach(() => transition.destroy());

  const snapshot = (element: HTMLElement) => Array.from(element.children).map(layer => ({
    className: layer.className,
    style: layer.getAttribute('style') || '',
    imageStyle: layer.querySelector('img')!.getAttribute('style') || '',
    hidden: layer.getAttribute('aria-hidden'),
  }));

  it('starts as a bottom-centred semicircle and exactly retraces it after reversing', () => {
    transition.setProgress(0.35);
    const forward = snapshot(stage);
    const clip = (stage.children[1] as HTMLElement).style.clipPath;
    expect(clip).toMatch(/^circle\([\d.]+px at 50% 100%\)$/);
    expect(parseFloat(clip.slice(7))).toBeLessThan(200);
    transition.setProgress(0.7);
    transition.setProgress(0.35);
    expect(snapshot(stage)).toEqual(forward);
  });

  it('returns to the same frame after jumping over multiple services in both directions', () => {
    transition.setProgress(1.5);
    const forward = snapshot(stage);
    transition.setProgress(4);
    expect(stage.querySelectorAll('.is-active').length).toBe(1);
    expect(stage.children[4].getAttribute('aria-hidden')).toBe('false');
    transition.setProgress(1.5);
    expect(snapshot(stage)).toEqual(forward);
  });

  it('uses still image changes for reduced motion, with no zoom or partial mask', () => {
    Object.defineProperty(motion, 'matches', { value: true });
    transition.setProgress(0.6);
    expect((stage.children[1] as HTMLElement).style.clipPath).toBe('none');
    expect(stage.children[1].querySelector('img')!.style.transform).toBe('none');
    expect(stage.querySelector('.is-revealing')).toBeNull();
  });

  it('cleans up styles and motion listeners when the page is destroyed', () => {
    transition.setProgress(2.5);
    transition.destroy();
    expect(stage.querySelectorAll('.is-active').length).toBe(1);
    expect(stage.children[0].classList.contains('is-active')).toBeTrue();
    expect(stage.querySelector('[style*="circle"]')).toBeNull();
    expect(motion.removeEventListener).toHaveBeenCalled();
  });
});
