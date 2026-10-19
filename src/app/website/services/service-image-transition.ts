export interface ServiceImageTransition {
  transitionTo(index: number): void;
  destroy(): void;
}

interface ImageTexture {
  texture: WebGLTexture;
  aspect: number;
}

// A circular refracting lens, matching the supplied reference. Only the reveal
// boundary blends (one screen pixel); the two photographs never crossfade.
const fragmentSource = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform vec2 uSize;
uniform float uFromAspect;
uniform float uToAspect;
uniform float uProgress;

vec2 coverUv(vec2 uv, float imageAspect) {
  float aspect = uSize.x / uSize.y;
  return (uv - 0.5) * vec2(min(aspect / imageAspect, 1.0), min(imageAspect / aspect, 1.0)) + 0.5;
}

void main() {
  vec4 previous = texture2D(uFrom, coverUv(vUv, uFromAspect));
  if (uProgress <= 0.0) { gl_FragColor = previous; return; }
  if (uProgress >= 1.0) {
    gl_FragColor = texture2D(uTo, coverUv(vUv, uToAspect));
    return;
  }

  vec2 metric = uSize / min(uSize.x, uSize.y);
  vec2 offset = (vUv - 0.5) * metric;
  float distanceFromCenter = length(offset);
  float maximumRadius = length(metric * 0.5);
  float expansion = 1.0 - pow(1.0 - uProgress, 1.3);
  float radius = maximumRadius * expansion;
  float normalizedRadius = clamp(distanceFromCenter / max(radius, 0.0001), 0.0, 1.0);

  // A convex lens magnifies the center and compresses the image near its rim.
  // Refraction relaxes as the bubble fills the frame, leaving a sharp still.
  float sphere = sqrt(max(0.0, 1.0 - normalizedRadius * normalizedRadius));
  float strength = 0.82 * pow(1.0 - uProgress, 1.15);
  vec2 refracted = 0.5 + (vUv - 0.5) * (1.0 - strength * sphere);
  vec4 incoming = texture2D(uTo, coverUv(refracted, uToAspect));
  float pixel = 1.0 / min(uSize.x, uSize.y);
  float inside = 1.0 - smoothstep(radius - pixel, radius + pixel, distanceFromCenter);
  gl_FragColor = mix(previous, incoming, inside);
}
`;

export async function createServiceImageTransition(
  canvas: HTMLCanvasElement,
  imageUrls: readonly string[],
  initialIndex: number,
  signal?: AbortSignal,
): Promise<ServiceImageTransition> {
  if (signal?.aborted) throw new Error('Image transition cancelled');
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false });
  if (!gl) throw new Error('WebGL unavailable');

  const shaders: WebGLShader[] = [];
  const textures: ImageTexture[] = [];
  const program = gl.createProgram()!;
  const buffer = gl.createBuffer()!;
  let frame = 0;
  let destroyed = false;
  let running = false;
  let current = initialIndex;
  let target = initialIndex;
  let requested = initialIndex;
  let started = 0;
  const duration = 760;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer: ResizeObserver | undefined;

  const dispose = () => {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(frame);
    observer?.disconnect();
    reducedMotion.removeEventListener('change', onMotionChange);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    signal?.removeEventListener('abort', dispose);
    textures.forEach(image => gl.deleteTexture(image.texture));
    shaders.forEach(shader => gl.deleteShader(shader));
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    canvas.classList.remove('is-ready');
  };

  function onContextLost(event: Event): void {
    event.preventDefault();
    dispose();
  }

  function onMotionChange(): void {
    if (reducedMotion.matches && running) {
      cancelAnimationFrame(frame);
      current = target = requested;
      running = false;
      draw(1);
    }
  }

  function compile(type: number, source: string): WebGLShader {
    const shader = gl!.createShader(type)!;
    shaders.push(shader);
    gl!.shaderSource(shader, source);
    gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) throw new Error('Image transition shader could not compile');
    return shader;
  }

  let uniforms: Record<string, WebGLUniformLocation | null>;

  function draw(progress: number): void {
    if (destroyed) return;
    gl!.useProgram(program);
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, textures[current].texture);
    gl!.activeTexture(gl!.TEXTURE1);
    gl!.bindTexture(gl!.TEXTURE_2D, textures[target].texture);
    gl!.uniform1i(uniforms['uFrom'], 0);
    gl!.uniform1i(uniforms['uTo'], 1);
    gl!.uniform2f(uniforms['uSize'], canvas.width, canvas.height);
    gl!.uniform1f(uniforms['uFromAspect'], textures[current].aspect);
    gl!.uniform1f(uniforms['uToAspect'], textures[target].aspect);
    gl!.uniform1f(uniforms['uProgress'], progress);
    gl!.drawArrays(gl!.TRIANGLES, 0, 6);
  }

  function animate(now: number): void {
    if (destroyed) return;
    const progress = Math.min((now - started) / duration, 1);
    draw(progress);
    if (progress < 1) {
      frame = requestAnimationFrame(animate);
    } else {
      current = target;
      running = false;
      transitionTo(requested);
    }
  }

  function transitionTo(index: number): void {
    if (destroyed || !textures[index]) return;
    requested = index;
    // Finish the visible reveal, then go directly to the latest scroll target.
    if (running || index === current) return;
    target = index;
    if (reducedMotion.matches || document.hidden) {
      current = target;
      draw(1);
      return;
    }
    started = performance.now();
    running = true;
    frame = requestAnimationFrame(animate);
  }

  try {
    gl.attachShader(program, compile(gl.VERTEX_SHADER, `
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main() {
        vUv = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Image transition could not initialize');
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    uniforms = Object.fromEntries(['uFrom', 'uTo', 'uSize', 'uFromAspect', 'uToAspect', 'uProgress']
      .map(name => [name, gl.getUniformLocation(program, name)]));

    canvas.addEventListener('webglcontextlost', onContextLost);
    signal?.addEventListener('abort', dispose, { once: true });
    // Upload only after every source decodes so scrolling never reveals a blank texture.
    const images = await Promise.all(imageUrls.map(url => new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      const cleanup = () => {
        image.onload = image.onerror = null;
        signal?.removeEventListener('abort', abort);
      };
      const abort = () => {
        cleanup();
        image.removeAttribute('src');
        reject(new Error('Image transition cancelled'));
      };
      image.onload = () => { cleanup(); resolve(image); };
      image.onerror = () => { cleanup(); reject(new Error('Service image unavailable')); };
      signal?.addEventListener('abort', abort, { once: true });
      image.src = url;
    })));
    if (destroyed || gl.isContextLost()) throw new Error('Image transition context unavailable');

    images.forEach(image => {
      const texture = gl.createTexture()!;
      textures.push({ texture, aspect: image.naturalWidth / image.naturalHeight });
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw(running ? Math.min((performance.now() - started) / duration, 1) : 1);
    };
    resize();
    observer = new ResizeObserver(resize);
    observer.observe(canvas);
    reducedMotion.addEventListener('change', onMotionChange);
    canvas.classList.add('is-ready');
    draw(1);
    return { transitionTo, destroy: dispose };
  } catch (error) {
    dispose();
    throw error;
  }
}
