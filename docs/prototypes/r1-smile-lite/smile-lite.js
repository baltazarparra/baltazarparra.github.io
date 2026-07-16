const canvas = document.querySelector("[data-smile-canvas]");
const stage = canvas?.closest(".smile-stage");
const status = document.querySelector("[data-status]");
const assetMetric = document.querySelector('[data-metric="asset"]');
const initMetric = document.querySelector('[data-metric="init"]');
const frameMetric = document.querySelector('[data-metric="frame"]');
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const startedAt = performance.now();
const geometryUrl = new URL("./smile-lite.bin", import.meta.url);

const metrics = {
  assetBytes: 0,
  initMs: 0,
  frameTimes: [],
  get frameP95() {
    if (this.frameTimes.length === 0) return 0;
    const sorted = [...this.frameTimes].sort((a, b) => a - b);
    return sorted[Math.floor((sorted.length - 1) * 0.95)];
  },
};
window.__smileLiteMetrics = metrics;

const vertexSource = `
  attribute vec3 aPosition;
  attribute vec3 aNormal;
  uniform vec2 uRotation;
  uniform float uRoll;
  uniform float uScale;
  uniform float uAspect;
  uniform float uYOffset;
  uniform float uScreenOffset;
  varying vec3 vNormal;
  varying vec3 vPosition;

  mat3 rotateX(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
  }

  mat3 rotateY(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
  }

  mat3 rotateZ(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0);
  }

  void main() {
    mat3 rotation = rotateZ(uRoll) * rotateY(uRotation.y) * rotateX(uRotation.x);
    vec3 position = rotation * aPosition;
    position *= uScale;
    position.y += uYOffset;
    position.z += 3.4;
    float focalLength = 2.5;
    gl_Position = vec4(
      position.x * focalLength / uAspect + uScreenOffset * position.z,
      position.y * focalLength,
      position.z - 0.2,
      position.z
    );
    vNormal = normalize(rotation * aNormal);
    vPosition = position;
  }
`;

const fragmentSource = `
  precision mediump float;
  uniform vec2 uPointer;
  uniform vec3 uTint;
  uniform float uAlpha;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;

  float random(vec2 point) {
    return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDirection = normalize(vec3(uPointer * 1.25, 1.6));
    float diffuse = max(dot(normal, lightDirection), 0.0);
    float backLight = max(dot(normal, normalize(vec3(-0.6, 0.8, -0.45))), 0.0);
    float rim = pow(1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0), 2.25);
    float grain = (random(gl_FragCoord.xy + floor(uTime * 12.0)) - 0.5) * 0.022;
    vec3 base = vec3(0.032, 0.036, 0.043);
    vec3 accent = vec3(1.0, 0.36, 0.18);
    vec3 color = mix(base, uTint, 0.24);
    color += accent * diffuse * 0.2;
    color += vec3(0.38, 0.42, 0.5) * backLight * 0.11;
    color += uTint * rim * 0.46;
    color += grain;
    gl_FragColor = vec4(color, uAlpha);
  }
`;

const compileShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "Shader compilation failed";
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
};

const createProgram = (gl) => {
  const program = gl.createProgram();
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || "Program link failed");
  }
  return program;
};

const parseGeometry = (buffer) => {
  const view = new DataView(buffer);
  const magic = String.fromCharCode(...new Uint8Array(buffer, 0, 4));
  const version = view.getUint32(4, true);
  if (magic !== "SMIL" || version !== 1) {
    throw new Error("Unsupported Smile geometry");
  }
  const vertexCount = view.getUint32(8, true);
  const indexCount = view.getUint32(12, true);
  const positionBytes = view.getUint32(16, true);
  const normalBytes = view.getUint32(20, true);
  const indexBytes = view.getUint32(24, true);
  const normalPadding = view.getUint32(28, true);
  const positionOffset = 32;
  const normalOffset = positionOffset + positionBytes;
  const indexOffset = normalOffset + normalBytes + normalPadding;
  if (indexOffset + indexBytes !== buffer.byteLength) {
    throw new Error("Corrupt Smile geometry length");
  }
  return {
    vertexCount,
    indexCount,
    indexBytes,
    positionOffset,
    normalOffset,
    indexOffset,
  };
};

const updateMetricLabels = () => {
  if (assetMetric) assetMetric.textContent = `${(metrics.assetBytes / 1024).toFixed(1)} KB`;
  if (initMetric) initMetric.textContent = `${metrics.initMs.toFixed(1)} ms`;
  if (frameMetric) frameMetric.textContent = `${metrics.frameP95.toFixed(2)} ms`;
};

const fail = (message) => {
  if (status) status.textContent = message;
  stage?.setAttribute("data-failed", "true");
};

const init = async () => {
  if (!canvas || !stage) return;
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: true,
    powerPreference: "low-power",
    premultipliedAlpha: true,
  });
  if (!gl) {
    fail("Static fallback — WebGL unavailable");
    return;
  }

  const response = await fetch(geometryUrl, { cache: "force-cache" });
  if (!response.ok) throw new Error(`Geometry request failed: ${response.status}`);
  const buffer = await response.arrayBuffer();
  metrics.assetBytes = buffer.byteLength;
  const geometry = parseGeometry(buffer);
  const program = createProgram(gl);
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint8Array(buffer, 0, geometry.indexOffset),
    gl.STATIC_DRAW,
  );

  const positionLocation = gl.getAttribLocation(program, "aPosition");
  const normalLocation = gl.getAttribLocation(program, "aNormal");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(
    positionLocation,
    3,
    gl.SHORT,
    true,
    0,
    geometry.positionOffset,
  );
  gl.enableVertexAttribArray(normalLocation);
  gl.vertexAttribPointer(
    normalLocation,
    3,
    gl.BYTE,
    true,
    0,
    geometry.normalOffset,
  );

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint8Array(buffer, geometry.indexOffset, geometry.indexBytes),
    gl.STATIC_DRAW,
  );
  gl.useProgram(program);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  const uniforms = Object.fromEntries(
    [
      "uRotation",
      "uRoll",
      "uScale",
      "uAspect",
      "uYOffset",
      "uScreenOffset",
      "uPointer",
      "uTint",
      "uAlpha",
      "uTime",
    ].map((name) => [name, gl.getUniformLocation(program, name)]),
  );

  const state = {
    rotationX: 0,
    rotationY: 0,
    targetX: 0,
    targetY: 0,
    pointerX: 0,
    pointerY: 0,
    aberration: 0,
    aberrationTarget: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    lastPointerAt: performance.now(),
    width: 1,
    height: 1,
    inView: true,
    running: false,
    lastFrameAt: 0,
    settleUntil: 0,
  };

  const resize = () => {
    const bounds = stage.getBoundingClientRect();
    const mobile = bounds.width < 768 || navigator.maxTouchPoints > 0;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.25);
    state.width = Math.max(1, Math.round(bounds.width * dpr));
    state.height = Math.max(1, Math.round(bounds.height * dpr));
    if (canvas.width !== state.width || canvas.height !== state.height) {
      canvas.width = state.width;
      canvas.height = state.height;
      gl.viewport(0, 0, state.width, state.height);
    }
  };

  const drawPass = (offset, tint, alpha) => {
    gl.uniform1f(uniforms.uScreenOffset, offset);
    gl.uniform3fv(uniforms.uTint, tint);
    gl.uniform1f(uniforms.uAlpha, alpha);
    gl.drawElements(
      gl.TRIANGLES,
      geometry.indexCount,
      gl.UNSIGNED_SHORT,
      0,
    );
  };

  const render = (time) => {
    const aspect = state.width / state.height;
    const mobile = state.width < state.height;
    const float = reducedMotion.matches ? 0 : Math.sin(time * 0.00062) * 0.035;
    const roll = reducedMotion.matches ? -0.055 : -0.055 + Math.cos(time * 0.00038) * 0.055;
    state.rotationX += (state.targetX - state.rotationX) * 0.075;
    state.rotationY += (state.targetY - state.rotationY) * 0.075;
    state.aberration += (state.aberrationTarget - state.aberration) * 0.12;
    state.aberrationTarget *= 0.9;

    gl.clearColor(0, 0, 0, 0);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform2f(uniforms.uRotation, state.rotationX, state.rotationY);
    gl.uniform1f(uniforms.uRoll, roll);
    gl.uniform1f(uniforms.uScale, mobile ? 1.06 : 1.18);
    gl.uniform1f(uniforms.uAspect, aspect);
    gl.uniform1f(uniforms.uYOffset, float - (mobile ? 0.03 : 0));
    gl.uniform2f(uniforms.uPointer, state.pointerX, state.pointerY);
    gl.uniform1f(uniforms.uTime, time * 0.001);

    const split = Math.min(0.006, state.aberration * 0.006);
    drawPass(-split, [1, 0.12, 0.04], 0.18);
    drawPass(split, [0.06, 0.28, 1], 0.13);
    drawPass(0, [0.16, 0.18, 0.22], 1);
  };

  const frame = (time) => {
    state.running = false;
    if (!state.inView || document.hidden) return;
    if (state.lastFrameAt > 0) {
      const delta = time - state.lastFrameAt;
      if (delta < 100) {
        metrics.frameTimes.push(delta);
        if (metrics.frameTimes.length > 360) metrics.frameTimes.shift();
      }
    }
    state.lastFrameAt = time;
    render(time);
    if (
      !reducedMotion.matches &&
      (finePointer.matches || time < state.settleUntil)
    ) {
      state.running = true;
      requestAnimationFrame(frame);
    }
  };

  const requestFrame = () => {
    if (state.running || !state.inView || document.hidden) return;
    state.running = true;
    requestAnimationFrame(frame);
  };

  const handlePointer = (event) => {
    const bounds = stage.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const y = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
    const now = performance.now();
    const elapsed = Math.max(8, now - state.lastPointerAt);
    const velocity = Math.hypot(
      x - state.lastPointerX,
      y - state.lastPointerY,
    ) / elapsed;
    state.pointerX = Math.max(-1, Math.min(1, x));
    state.pointerY = Math.max(-1, Math.min(1, y));
    state.targetX = state.pointerY * 0.2;
    state.targetY = state.pointerX * 0.36;
    state.aberrationTarget = Math.min(1, velocity * 120);
    state.lastPointerX = x;
    state.lastPointerY = y;
    state.lastPointerAt = now;
    state.settleUntil = now + 450;
    requestFrame();
  };

  const resetPointer = () => {
    state.pointerX = 0;
    state.pointerY = 0;
    state.targetX = 0;
    state.targetY = 0;
    state.aberrationTarget = 0.65;
    state.settleUntil = performance.now() + 450;
    requestFrame();
  };

  const observer = new IntersectionObserver(([entry]) => {
    state.inView = entry.isIntersecting;
    if (state.inView) requestFrame();
  });
  observer.observe(stage);
  const resizeObserver = new ResizeObserver(() => {
    resize();
    requestFrame();
  });
  resizeObserver.observe(stage);
  stage.addEventListener("pointermove", handlePointer, { passive: true });
  stage.addEventListener("pointerleave", resetPointer, { passive: true });
  stage.addEventListener("pointercancel", resetPointer, { passive: true });
  document.addEventListener("visibilitychange", requestFrame);
  reducedMotion.addEventListener("change", requestFrame);
  finePointer.addEventListener("change", requestFrame);

  resize();
  render(performance.now());
  metrics.initMs = performance.now() - startedAt;
  stage.dataset.ready = "true";
  if (status) status.textContent = "Interactive — pointer and touch ready";
  updateMetricLabels();
  window.setInterval(updateMetricLabels, 600);
  requestFrame();
};

init().catch((error) => {
  console.error(error);
  fail("Static fallback — lightweight renderer failed");
});
