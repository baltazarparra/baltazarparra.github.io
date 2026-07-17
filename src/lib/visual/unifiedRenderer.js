import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollMotion } from "../motion/scrollMotion.js";


const canvas = document.querySelector("[data-unified-canvas]");
const smileSlot = document.querySelector("[data-smile-slot]");
const hero = document.querySelector("#hero");
const allLiquidSlots = [...document.querySelectorAll("[data-liquid-slot]")];
const rendererStatus = document.querySelector("[data-status]");
const contextMetric = document.querySelector('[data-metric="contexts"]');
const programMetric = document.querySelector('[data-metric="programs"]');
const frameMetric = document.querySelector('[data-metric="frame"]');
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const liquidSlots = allLiquidSlots;
const geometryUrl = new URL("/smile-lite.bin", window.location.origin);
const SMILE_CAMERA_DEPTH = 3.4;
const SMILE_FOCAL_LENGTH = 2.5;
const SMILE_SLOT_ROLL = -0.05;
const SMILE_DOCK_ROLL = -0.02;
const SMILE_DOCK_WIDTH_RATIO = 0.9;
const SMILE_DOCK_VISIBLE_HEIGHT_RATIO = 0.2;
const liquidUrls = liquidSlots.map((slot) =>
  new URL(slot.dataset.liquidSource || "/baltz-portrait.webp", window.location.origin),
);

const metrics = {
  contexts: 0,
  programs: 0,
  surfaces: liquidSlots.length,
  quality: "unknown",
  renderer: "unknown",
  smileProgress: 0,
  scrollImpulse: 0,
  smileVisible: false,
  smileDocked: false,
  smileWidthRatio: 0,
  smileVisibleHeightRatio: 0,
  mediaReady: 0,
  mediaHover: 0,
  mediaVelocity: 0,
  mediaTrailDistance: 0,
  mediaRippleStrength: 0,
  mediaRippleCount: 0,
  frameTimes: [],
  get frameP95() {
    if (this.frameTimes.length === 0) return 0;
    const sorted = [...this.frameTimes].sort((a, b) => a - b);
    return sorted[Math.floor((sorted.length - 1) * 0.95)];
  },
};
window.__unifiedRendererMetrics = metrics;

const quadVertexSource = `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const rippleVertexSource = `
  attribute vec2 aPosition;
  uniform vec2 uCenter;
  uniform float uRadius;
  uniform float uRotation;
  varying vec2 vBrushUv;

  void main() {
    float sine = sin(uRotation);
    float cosine = cos(uRotation);
    mat2 rotation = mat2(cosine, -sine, sine, cosine);
    vec2 position = rotation * aPosition * uRadius;
    vBrushUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(uCenter * 2.0 - 1.0 + position, 0.0, 1.0);
  }
`;

const rippleFragmentSource = `
  precision mediump float;
  varying vec2 vBrushUv;
  uniform float uOpacity;
  uniform float uPhase;

  void main() {
    vec2 point = (vBrushUv - 0.5) * 2.0;
    float angle = atan(point.y, point.x);
    float wobble = 1.0
      + sin(angle * 3.0 + uPhase) * 0.11
      + sin(angle * 5.0 - uPhase * 0.73) * 0.065;
    float distanceFromCenter = length(point) / wobble;
    float body = 1.0 - smoothstep(0.72, 1.0, distanceFromCenter);
    float hollow = 1.0 - smoothstep(0.24, 0.58, distanceFromCenter);
    float brokenRing = max(0.0, body - hollow * 0.82);
    float innerCurrent = (1.0 - smoothstep(0.0, 0.34, distanceFromCenter)) * 0.16;
    float texture = 0.82 + 0.18 * sin(angle * 4.0 + distanceFromCenter * 7.0 + uPhase);
    float strength = (brokenRing * texture + innerCurrent) * uOpacity;
    gl_FragColor = vec4(vec3(strength), strength);
  }
`;

const backgroundFragmentSource = `
  precision mediump float;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uTime;
  uniform float uMotion;

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
    vec2 pointer = (uPointer - 0.5) * vec2(aspect, 1.0);
    float time = uTime * 0.22;
    float wake = exp(-dot(p - pointer, p - pointer) * 7.2) * uMotion;
    float flowA = 0.5 + 0.5 * sin(p.x * 2.6 + p.y * 1.3 + time);
    float flowB = 0.5 + 0.5 * sin((p.x - p.y) * 3.2 - time * 0.72);
    float flow = flowA * 0.62 + flowB * 0.38;
    float vein = smoothstep(0.76, 0.96, flow + wake * 0.32);
    vec3 canvas = vec3(0.047, 0.051, 0.059);
    vec3 cool = vec3(0.075, 0.087, 0.105);
    vec3 ember = vec3(0.42, 0.13, 0.075);
    vec3 color = mix(canvas, cool, flowB * 0.12);
    color = mix(color, ember, vein * (0.1 + wake * 0.22));
    float vignette = smoothstep(0.72, 0.12, length(p));
    color *= 0.82 + vignette * 0.18;
    gl_FragColor = vec4(color, vignette * (0.08 + uMotion * 0.18));
  }
`;

const mediaFragmentSource = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform sampler2D uRipples;
  uniform vec2 uPointer;
  uniform vec2 uTrailPointer;
  uniform vec2 uRippleTexel;
  uniform float uRippleStrength;
  uniform float uHover;
  uniform float uVelocity;
  uniform float uReveal;
  uniform float uPortrait;
  uniform float uScrollMotion;
  uniform float uScrollDirection;
  uniform float uSurfaceBend;
  uniform vec2 uEdgePoint;
  uniform vec2 uEdgeNormal;
  uniform vec2 uEdgeInset;
  uniform float uEdgePulse;
  uniform float uEdgeStartedAt;
  uniform float uEdgePolarity;
  uniform float uTime;
  uniform float uViewportAspect;
  uniform float uTextureAspect;

  vec2 coverUv(vec2 uv) {
    float ratio = uViewportAspect / uTextureAspect;
    if (ratio > 1.0) {
      uv.y = (uv.y - 0.5) / ratio + 0.5;
    } else {
      uv.x = (uv.x - 0.5) * ratio + 0.5;
    }
    return uv;
  }

  float rippleAt(vec2 uv) {
    return texture2D(uRipples, clamp(uv, 0.001, 0.999)).r;
  }

  void main() {
    vec2 surfaceUv = (vUv - uEdgeInset) / max(vec2(0.001), vec2(1.0) - uEdgeInset * 2.0);
    vec2 rippleUv = clamp(surfaceUv, 0.001, 0.999);
    float rippleCenter = 0.0;
    vec2 rippleGradient = vec2(0.0);
    if (uRippleStrength > 0.0005) {
      rippleCenter = rippleAt(rippleUv);
      rippleGradient = vec2(
        rippleAt(rippleUv + vec2(uRippleTexel.x, 0.0))
          - rippleAt(rippleUv - vec2(uRippleTexel.x, 0.0)),
        rippleAt(rippleUv + vec2(0.0, uRippleTexel.y))
          - rippleAt(rippleUv - vec2(0.0, uRippleTexel.y))
      );
    }
    float rippleAngle = rippleCenter * 6.28318530718;
    vec2 rippleDirection = vec2(sin(rippleAngle), cos(rippleAngle));
    vec2 liquidWarp = (
      rippleDirection * rippleCenter + rippleGradient * 0.42
    ) * uRippleStrength;
    float edgeAge = max(0.0, uTime - uEdgeStartedAt);
    vec2 impactDelta = surfaceUv - uEdgePoint;
    vec2 correctedImpact = impactDelta * vec2(uViewportAspect, 1.0);
    float impactDistance = length(correctedImpact);
    vec2 impactDirection = correctedImpact / max(impactDistance, 0.001);
    impactDirection.x /= max(uViewportAspect, 0.001);
    vec2 tangentAxis = vec2(-uEdgeNormal.y, uEdgeNormal.x);
    float tangentOffset = dot(impactDelta, tangentAxis);
    float impactAttack = smoothstep(0.0, 0.12, edgeAge);
    float impactDecay = uEdgePulse * impactAttack * exp(-edgeAge * 1.85);
    float localInfluence = exp(-impactDistance * 1.45);
    vec2 centerDelta = (vec2(0.5) - uEdgePoint) * vec2(uViewportAspect, 1.0);
    float centerInfluence = exp(-length(centerDelta) * 1.45);
    float anchoredInfluence = localInfluence - centerInfluence;
    float impactInfluence = localInfluence;
    float impactWave = sin(impactDistance * 19.0 - edgeAge * 10.5);
    float waveFront = exp(-pow(impactDistance - edgeAge * 0.62, 2.0) * 52.0);
    float signedPush = impactDecay * anchoredInfluence
      * (0.030 * uEdgePolarity + impactWave * 0.012);
    vec2 componentWarp = uEdgeNormal * signedPush;
    componentWarp += impactDirection * waveFront * impactDecay * 0.016;
    componentWarp += tangentAxis * tangentOffset * impactDecay
      * localInfluence * uEdgePolarity * 0.015;
    componentWarp += (surfaceUv - 0.5) * impactDecay
      * localInfluence * uEdgePolarity * 0.009;
    componentWarp *= uPortrait;
    vec2 shapeUv = surfaceUv - componentWarp + liquidWarp * uPortrait * 0.34;

    if (
      shapeUv.x < 0.0 || shapeUv.x > 1.0 ||
      shapeUv.y < 0.0 || shapeUv.y > 1.0
    ) discard;

    float bendMagnitude = abs(uSurfaceBend);
    float horizontal = shapeUv.x * 2.0 - 1.0;
    float arch = 1.0 - horizontal * horizontal;
    float verticalShift = uSurfaceBend >= 0.0
      ? bendMagnitude * (1.0 - arch)
      : bendMagnitude * arch;
    if (
      shapeUv.y < bendMagnitude - verticalShift ||
      shapeUv.y > 1.0 - verticalShift
    ) discard;

    vec2 uv = coverUv(shapeUv);
    vec3 color;
    float radius = 1.0;

    float scrollWave = sin((shapeUv.y * 17.0) - uTime * 7.0) * uScrollMotion;
    vec2 scrollOffset = vec2(scrollWave * 0.008 * uScrollDirection, scrollWave * 0.003);

    vec2 hoverDisplacement = vec2(0.0);
    if (uHover > 0.002) {
      vec2 delta = shapeUv - uPointer;
      vec2 corrected = delta * vec2(uViewportAspect, 1.0);
      radius = length(corrected);
      vec2 trailDelta = shapeUv - uTrailPointer;
      vec2 correctedTrail = trailDelta * vec2(uViewportAspect, 1.0);
      float trailRadius = length(correctedTrail);
      vec2 pointerFlow = (uPointer - uTrailPointer) * vec2(uViewportAspect, 1.0);
      float pointerFlowLength = length(pointerFlow);
      vec2 flowDirection = pointerFlow / max(pointerFlowLength, 0.001);
      flowDirection.x /= max(uViewportAspect, 0.001);
      float speed = smoothstep(0.015, 0.38, uVelocity);
      float wake = smoothstep(0.52, 0.0, trailRadius) * speed * uHover;
      float liquidPresence = smoothstep(0.015, 0.42, rippleCenter) * uHover;
      vec2 tangentFlow = vec2(-rippleGradient.y, rippleGradient.x);
      hoverDisplacement = liquidWarp * (0.72 + speed * 0.24);
      hoverDisplacement -= flowDirection * wake * 0.006;
      hoverDisplacement += tangentFlow * liquidPresence * 0.006;
    }

    if (uPortrait > 0.5) {
      vec2 refractedUv = coverUv(shapeUv + hoverDisplacement + scrollOffset);
      vec2 prism = uEdgeNormal * impactWave * impactDecay * impactInfluence * 0.0011;
      color.r = texture2D(uTexture, clamp(refractedUv + prism, 0.001, 0.999)).r;
      color.g = texture2D(uTexture, clamp(refractedUv, 0.001, 0.999)).g;
      color.b = texture2D(uTexture, clamp(refractedUv - prism, 0.001, 0.999)).b;
      if (uHover > 0.002 && rippleCenter > 0.01) {
        vec2 blurVector = liquidWarp * 0.075;
        vec3 blurBefore = texture2D(
          uTexture,
          clamp(refractedUv - blurVector, 0.001, 0.999)
        ).rgb;
        vec3 blurAfter = texture2D(
          uTexture,
          clamp(refractedUv + blurVector, 0.001, 0.999)
        ).rgb;
        float blurMix = smoothstep(0.01, 0.34, rippleCenter) * 0.46;
        color = mix(color, (blurBefore + color + blurAfter) / 3.0, blurMix);
      }
      color *= 0.99 + waveFront * impactDecay * 0.025;
    } else {
      uv = coverUv(shapeUv + hoverDisplacement + scrollOffset);
      color = texture2D(uTexture, clamp(uv, 0.001, 0.999)).rgb;
    }

    color = mix(color, color * vec3(1.02, 0.91, 0.86), 0.22);
    color *= 0.84 + smoothstep(0.72, 0.0, radius) * uHover * 0.2;
    gl_FragColor = vec4(color, uReveal);
  }
`;

const smileVertexSource = `
  attribute vec3 aPosition;
  attribute vec3 aNormal;
  uniform vec2 uRotation;
  uniform float uRoll;
  uniform float uScale;
  uniform float uAspect;
  uniform float uYOffset;
  uniform vec2 uAnchor;
  uniform vec2 uScreenOffset;
  varying vec3 vNormal;

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
    position.z += ${SMILE_CAMERA_DEPTH.toFixed(1)};
    float focalLength = ${SMILE_FOCAL_LENGTH.toFixed(1)};
    gl_Position = vec4(
      position.x * focalLength / uAspect + (uAnchor.x + uScreenOffset.x) * position.z,
      position.y * focalLength + (uAnchor.y + uScreenOffset.y) * position.z,
      position.z - 0.2,
      position.z
    );
    vNormal = normalize(rotation * aNormal);
  }
`;

const smileFragmentSource = `
  precision mediump float;
  uniform vec2 uPointer;
  uniform vec3 uTint;
  uniform float uAlpha;
  uniform float uPresence;
  uniform float uTime;
  varying vec3 vNormal;

  float random(vec2 point) {
    return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDirection = normalize(vec3(uPointer * 1.2, 1.5));
    float diffuse = max(dot(normal, lightDirection), 0.0);
    float backLight = max(dot(normal, normalize(vec3(-0.6, 0.8, -0.45))), 0.0);
    float rim = pow(1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0), 2.2);
    float grain = (random(gl_FragCoord.xy + floor(uTime * 12.0)) - 0.5) * 0.018;
    vec3 base = vec3(0.034, 0.039, 0.047);
    vec3 accent = vec3(0.85, 0.28, 0.14);
    vec3 color = mix(base, uTint, 0.22);
    color += accent * diffuse * 0.2;
    color += vec3(0.34, 0.4, 0.5) * backLight * 0.1;
    color += uTint * rim * 0.42;
    color += accent * rim * (0.06 + uPresence * 0.14);
    gl_FragColor = vec4(color + grain, uAlpha);
  }
`;

const compileShader = (gl, type, source) => {
  let lastMessage = "Shader compilation failed";
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    lastMessage = gl.getShaderInfoLog(shader) || lastMessage;
    gl.deleteShader(shader);
  }
  const label = type === gl.VERTEX_SHADER ? "vertex" : "fragment";
  throw new Error(`${label} shader compilation failed: ${lastMessage}`);
};

const createProgram = (gl, vertexSource, fragmentSource) => {
  const program = gl.createProgram();
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || "Program link failed");
  }
  metrics.programs += 1;
  return program;
};

const uniformsFor = (gl, program, names) =>
  Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(program, name)]));

const parseGeometry = (buffer) => {
  const view = new DataView(buffer);
  const magic = String.fromCharCode(...new Uint8Array(buffer, 0, 4));
  const version = view.getUint32(4, true);
  if (magic !== "SMIL" || version !== 1) throw new Error("Unsupported Smile geometry");
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
  const positions = new Int16Array(buffer, positionOffset, positionBytes / 2);
  return { indexCount, indexBytes, positionOffset, normalOffset, indexOffset, positions };
};

const loadImage = async (url) => {
  const image = new Image();
  image.decoding = "async";
  image.src = url;
  if (image.decode) await image.decode();
  else await new Promise((resolve, reject) => {
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", reject, { once: true });
  });
  return image;
};

const rectIsVisible = (rect) => {
  if (rect.bottom <= 0 || rect.top >= window.innerHeight || rect.width <= 0 || rect.height <= 0) {
    return false;
  }
  return true;
};

const viewportRevealFor = (rect) => {
  const visibleHeight = Math.max(
    0,
    Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0),
  );
  const fadeBand = Math.max(1, Math.min(120, rect.height * 0.24));
  return Math.min(1, visibleHeight / fadeBand);
};

const viewportFor = (rect, dpr) => ({
  x: Math.max(0, Math.round(rect.left * dpr)),
  y: Math.max(0, Math.round((window.innerHeight - rect.bottom) * dpr)),
  width: Math.min(Math.round(rect.width * dpr), Math.round(window.innerWidth * dpr)),
  height: Math.min(Math.round(rect.height * dpr), Math.round(window.innerHeight * dpr)),
});

const updateLabels = () => {
  if (contextMetric) contextMetric.textContent = String(metrics.contexts);
  if (programMetric) programMetric.textContent = String(metrics.programs);
  if (frameMetric) frameMetric.textContent = `${metrics.frameP95.toFixed(2)} ms`;
};

const fail = (message) => {
  document.documentElement.dataset.renderer = "fallback";
  document.documentElement.dataset.liquid = "static";
  liquidSlots.forEach((slot) => {
    if (slot.dataset.mediaState !== "ready") slot.dataset.mediaState = "error";
  });
  if (rendererStatus) rendererStatus.textContent = message;
};

const init = async () => {
  if (!canvas || !smileSlot) {
    fail("CSS and image fallback — renderer mount unavailable");
    return;
  }
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: true,
    powerPreference: "low-power",
    premultipliedAlpha: true,
  });
  if (!gl) {
    fail("CSS and image fallback — WebGL unavailable");
    return;
  }
  metrics.contexts = 1;
  const rendererInfo = gl.getExtension("WEBGL_debug_renderer_info");
  const rendererName = rendererInfo
    ? gl.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL)
    : gl.getParameter(gl.RENDERER);
  const softwareRenderer = /swiftshader|software|llvmpipe/i.test(rendererName || "");
  metrics.renderer = rendererName || "unknown";
  metrics.quality = softwareRenderer ? "compatibility" : "full";

  const geometryResponse = await fetch(geometryUrl, { cache: "force-cache" });
  if (!geometryResponse.ok) {
    throw new Error(`Geometry request failed: ${geometryResponse.status}`);
  }
  const geometryBufferSource = await geometryResponse.arrayBuffer();
  const geometry = parseGeometry(geometryBufferSource);

  const backgroundProgram = createProgram(gl, quadVertexSource, backgroundFragmentSource);
  const rippleProgram = createProgram(gl, rippleVertexSource, rippleFragmentSource);
  const mediaProgram = createProgram(gl, quadVertexSource, mediaFragmentSource);
  const smileProgram = createProgram(gl, smileVertexSource, smileFragmentSource);

  const backgroundUniforms = uniformsFor(gl, backgroundProgram, [
    "uResolution", "uPointer", "uTime", "uMotion",
  ]);
  const rippleUniforms = uniformsFor(gl, rippleProgram, [
    "uCenter", "uRadius", "uRotation", "uOpacity", "uPhase",
  ]);
  const mediaUniforms = uniformsFor(gl, mediaProgram, [
    "uTexture", "uRipples", "uPointer", "uTrailPointer", "uRippleTexel", "uRippleStrength",
    "uHover", "uVelocity", "uReveal", "uPortrait", "uTime",
    "uViewportAspect", "uTextureAspect", "uScrollMotion", "uScrollDirection", "uSurfaceBend",
    "uEdgePoint", "uEdgeNormal", "uEdgeInset", "uEdgePulse", "uEdgeStartedAt", "uEdgePolarity",
  ]);
  const smileUniforms = uniformsFor(gl, smileProgram, [
    "uRotation", "uRoll", "uScale", "uAspect", "uYOffset",
    "uAnchor", "uScreenOffset", "uPointer", "uTint", "uAlpha", "uPresence", "uTime",
  ]);

  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const rippleResolution = 192;
  const createRippleTarget = () => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      rippleResolution,
      rippleResolution,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error("Ripple framebuffer is incomplete");
    }
    gl.viewport(0, 0, rippleResolution, rippleResolution);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { texture, framebuffer };
  };

  const smileVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, smileVertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint8Array(geometryBufferSource, 0, geometry.indexOffset),
    gl.STATIC_DRAW,
  );
  const smileIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, smileIndexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint8Array(geometryBufferSource, geometry.indexOffset, geometry.indexBytes),
    gl.STATIC_DRAW,
  );

  const createTexture = (image) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    return texture;
  };

  const state = {
    width: 1,
    height: 1,
    dpr: 1,
    pointerX: 0.5,
    pointerY: 0.5,
    pointerMotion: 0,
    pointerMotionTarget: 0,
    lastPointerX: 0.5,
    lastPointerY: 0.5,
    lastPointerAt: performance.now(),
    lastInputProcessedAt: 0,
    smileProgress: 0,
    scrollDirection: 1,
    scrollImpulse: 0,
    smileX: 0,
    smileY: 0,
    smileTargetX: 0,
    smileTargetY: 0,
    surfaceActive: false,
    running: false,
    visible: true,
    lastFrameAt: 0,
    settleUntil: 0,
    smileRect: smileSlot.getBoundingClientRect(),
    smileLayout: {
      slotScale: 0.4,
      slotAnchorX: 0,
      slotAnchorY: 0,
      dockScale: 1,
      dockAnchorY: -1,
      dockWidthRatio: SMILE_DOCK_WIDTH_RATIO,
      dockVisibleHeightRatio: SMILE_DOCK_VISIBLE_HEIGHT_RATIO,
    },
    surfaces: liquidSlots.map((element, index) => ({
      element,
      url: liquidUrls[index],
      image: null,
      texture: null,
      ready: false,
      failed: false,
      reveal: 0,
      rect: element.getBoundingClientRect(),
      x: 0.5,
      y: 0.5,
      trailX: 0.5,
      trailY: 0.5,
      pointerActive: false,
      rippleTarget: createRippleTarget(),
      ripples: Array.from({ length: 24 }, () => ({
        active: false,
        x: 0.5,
        y: 0.5,
        startedAt: 0,
        radius: 0.05,
        opacity: 0,
        rotation: 0,
        phase: 0,
      })),
      nextRipple: 0,
      rippleFieldActive: false,
      rippleStrength: 0,
      rippleStrengthTarget: 0,
      lastRippleAt: 0,
      hover: 0,
      hoverTarget: 0,
      velocity: 0,
      velocityTarget: 0,
      scrollMotion: 0,
      scrollScale: element.dataset.liquidMode === "portrait" ? 1 : 0.16,
      isPortrait: element.dataset.liquidMode === "portrait",
      surfaceBendStrength: Number(element.dataset.scrollSurfaceStrength) || 0,
      edgeEnabled: element.dataset.liquidMode === "portrait",
      edgePointX: 0.5,
      edgePointY: 0.5,
      edgeNormalX: 0,
      edgeNormalY: 0,
      edgePulse: 0,
      edgeStartedAt: 0,
      edgePolarity: 1,
      lastProcessedAt: 0,
    })),
  };

  const bindQuad = (program) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    const location = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
  };

  const setViewport = (viewport) => {
    gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
    gl.scissor(viewport.x, viewport.y, viewport.width, viewport.height);
  };

  const drawBackground = (time) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.disable(gl.SCISSOR_TEST);
    gl.disable(gl.DEPTH_TEST);
    gl.viewport(0, 0, state.width, state.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (state.surfaceActive) return;

    const wakeSize = Math.min(
      state.width,
      state.height,
      Math.max(220 * state.dpr, Math.min(320 * state.dpr, state.height * 0.38)),
    );
    const pointerPixelX = state.pointerX * state.width;
    const pointerPixelY = state.pointerY * state.height;
    const x = Math.max(0, Math.min(state.width - wakeSize, pointerPixelX - wakeSize * 0.5));
    const y = Math.max(0, Math.min(state.height - wakeSize, pointerPixelY - wakeSize * 0.5));
    const localPointerX = (pointerPixelX - x) / wakeSize;
    const localPointerY = (pointerPixelY - y) / wakeSize;

    gl.enable(gl.SCISSOR_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    setViewport({
      x: Math.round(x),
      y: Math.round(y),
      width: Math.max(1, Math.round(wakeSize)),
      height: Math.max(1, Math.round(wakeSize)),
    });
    gl.useProgram(backgroundProgram);
    bindQuad(backgroundProgram);
    gl.uniform2f(backgroundUniforms.uResolution, wakeSize, wakeSize);
    gl.uniform2f(backgroundUniforms.uPointer, localPointerX, localPointerY);
    gl.uniform1f(backgroundUniforms.uTime, time * 0.001);
    gl.uniform1f(backgroundUniforms.uMotion, state.pointerMotion);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const drawRippleField = (surface, time) => {
    if (!surface.rippleFieldActive) return;
    let activeCount = 0;
    const timeSeconds = time * 0.001;
    gl.bindFramebuffer(gl.FRAMEBUFFER, surface.rippleTarget.framebuffer);
    gl.disable(gl.SCISSOR_TEST);
    gl.disable(gl.DEPTH_TEST);
    gl.viewport(0, 0, rippleResolution, rippleResolution);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.useProgram(rippleProgram);
    bindQuad(rippleProgram);

    surface.ripples.forEach((ripple) => {
      if (!ripple.active) return;
      const age = Math.max(0, timeSeconds - ripple.startedAt);
      const life = 1.45;
      if (age >= life) {
        ripple.active = false;
        return;
      }
      activeCount += 1;
      const progress = age / life;
      const easedGrowth = 1 - (1 - progress) ** 2;
      const radius = ripple.radius + easedGrowth * 0.24;
      const opacity = ripple.opacity * (1 - progress) ** 2.35;
      gl.uniform2f(rippleUniforms.uCenter, ripple.x, ripple.y);
      gl.uniform1f(rippleUniforms.uRadius, radius * 2);
      gl.uniform1f(rippleUniforms.uRotation, ripple.rotation + age * 0.7);
      gl.uniform1f(rippleUniforms.uOpacity, opacity);
      gl.uniform1f(rippleUniforms.uPhase, ripple.phase + age * 1.4);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    });

    surface.rippleFieldActive = activeCount > 0;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  const drawMediaSurface = (surface, time) => {
    if (!surface.ready || !surface.texture || !surface.image || surface.reveal <= 0.001) return;
    const rect = surface.rect;
    if (!rectIsVisible(rect)) return;
    const edgePadding = surface.edgeEnabled ? Math.min(34, rect.width * 0.085) : 0;
    const expandedRect = {
      left: rect.left - edgePadding,
      right: rect.right + edgePadding,
      top: rect.top - edgePadding,
      bottom: rect.bottom + edgePadding,
      width: rect.width + edgePadding * 2,
      height: rect.height + edgePadding * 2,
    };
    const viewport = viewportFor(expandedRect, state.dpr);
    if (viewport.width < 1 || viewport.height < 1) return;
    drawRippleField(surface, time);
    gl.enable(gl.SCISSOR_TEST);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    setViewport(viewport);
    gl.useProgram(mediaProgram);
    bindQuad(mediaProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, surface.texture);
    gl.uniform1i(mediaUniforms.uTexture, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, surface.rippleTarget.texture);
    gl.uniform1i(mediaUniforms.uRipples, 1);
    gl.uniform2f(mediaUniforms.uPointer, surface.x, surface.y);
    gl.uniform2f(mediaUniforms.uTrailPointer, surface.trailX, surface.trailY);
    gl.uniform2f(
      mediaUniforms.uRippleTexel,
      1 / rippleResolution,
      1 / rippleResolution,
    );
    gl.uniform1f(mediaUniforms.uRippleStrength, surface.rippleStrength);
    gl.uniform1f(mediaUniforms.uHover, surface.hover);
    gl.uniform1f(mediaUniforms.uVelocity, surface.velocity);
    gl.uniform1f(mediaUniforms.uReveal, surface.reveal);
    gl.uniform1f(mediaUniforms.uPortrait, surface.isPortrait ? 1 : 0);
    gl.uniform1f(mediaUniforms.uScrollMotion, surface.scrollMotion);
    gl.uniform1f(mediaUniforms.uScrollDirection, state.scrollDirection);
    gl.uniform1f(
      mediaUniforms.uSurfaceBend,
      state.scrollImpulse * 0.035 * surface.surfaceBendStrength,
    );
    gl.uniform2f(mediaUniforms.uEdgePoint, surface.edgePointX, surface.edgePointY);
    gl.uniform2f(mediaUniforms.uEdgeNormal, surface.edgeNormalX, surface.edgeNormalY);
    gl.uniform2f(
      mediaUniforms.uEdgeInset,
      edgePadding / expandedRect.width,
      edgePadding / expandedRect.height,
    );
    gl.uniform1f(mediaUniforms.uEdgePulse, surface.edgePulse);
    gl.uniform1f(mediaUniforms.uEdgeStartedAt, surface.edgeStartedAt);
    gl.uniform1f(mediaUniforms.uEdgePolarity, surface.edgePolarity);
    gl.uniform1f(mediaUniforms.uTime, time * 0.001);
    gl.uniform1f(mediaUniforms.uViewportAspect, viewport.width / viewport.height);
    gl.uniform1f(mediaUniforms.uTextureAspect, surface.image.naturalWidth / surface.image.naturalHeight);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const drawMedia = (time) => {
    state.surfaces.forEach((surface) => drawMediaSurface(surface, time));
  };

  const drawSmilePass = (offsetX, offsetY, tint, alpha) => {
    gl.uniform2f(smileUniforms.uScreenOffset, offsetX, offsetY);
    gl.uniform3fv(smileUniforms.uTint, tint);
    gl.uniform1f(smileUniforms.uAlpha, alpha);
    gl.drawElements(gl.TRIANGLES, geometry.indexCount, gl.UNSIGNED_SHORT, 0);
  };

  const measureSmileProjection = (scale, roll) => {
    const aspect = state.width / Math.max(state.height, 1);
    const cosine = Math.cos(roll);
    const sine = Math.sin(roll);
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let offset = 0; offset < geometry.positions.length; offset += 3) {
      const x = geometry.positions[offset] / 32767;
      const y = geometry.positions[offset + 1] / 32767;
      const z = geometry.positions[offset + 2] / 32767;
      const rotatedX = cosine * x - sine * y;
      const rotatedY = sine * x + cosine * y;
      const projectedZ = z * scale + SMILE_CAMERA_DEPTH;
      const projectedX = rotatedX * scale * SMILE_FOCAL_LENGTH / aspect / projectedZ;
      const projectedY = rotatedY * scale * SMILE_FOCAL_LENGTH / projectedZ;
      minX = Math.min(minX, projectedX);
      maxX = Math.max(maxX, projectedX);
      minY = Math.min(minY, projectedY);
      maxY = Math.max(maxY, projectedY);
    }

    return {
      widthRatio: (maxX - minX) * 0.5,
      topNdc: maxY,
      bottomNdc: minY,
    };
  };

  const smileScaleForWidth = (targetWidthRatio, roll) => {
    let lower = 0.01;
    let upper = 6;
    for (let iteration = 0; iteration < 24; iteration += 1) {
      const candidate = (lower + upper) * 0.5;
      if (measureSmileProjection(candidate, roll).widthRatio < targetWidthRatio) {
        lower = candidate;
      } else {
        upper = candidate;
      }
    }
    return (lower + upper) * 0.5;
  };

  const updateSmileLayout = () => {
    const viewportWidth = Math.max(window.innerWidth, 1);
    const viewportHeight = Math.max(window.innerHeight, 1);
    const slotCenterDocumentY = state.smileRect.top
      + window.scrollY
      + state.smileRect.height * 0.5;
    const slotScale = smileScaleForWidth(
      Math.max(0.01, state.smileRect.width / viewportWidth),
      SMILE_SLOT_ROLL,
    );
    const dockScale = smileScaleForWidth(SMILE_DOCK_WIDTH_RATIO, SMILE_DOCK_ROLL);
    const dockProjection = measureSmileProjection(dockScale, SMILE_DOCK_ROLL);
    const dockTopNdc = SMILE_DOCK_VISIBLE_HEIGHT_RATIO * 2 - 1;
    const dockAnchorY = dockTopNdc - dockProjection.topNdc;

    state.smileLayout = {
      slotScale,
      slotAnchorX: (
        (state.smileRect.left + state.smileRect.width * 0.5) / viewportWidth
      ) * 2 - 1,
      slotAnchorY: 1 - (slotCenterDocumentY / viewportHeight) * 2,
      dockScale,
      dockAnchorY,
      dockWidthRatio: dockProjection.widthRatio,
      dockVisibleHeightRatio: (dockProjection.topNdc + dockAnchorY + 1) * 0.5,
    };
  };

  const drawSmile = (time) => {
    if (!hero) {
      metrics.smileVisible = false;
      return;
    }
    const viewport = { x: 0, y: 0, width: state.width, height: state.height };
    metrics.smileVisible = true;
    gl.enable(gl.SCISSOR_TEST);
    setViewport(viewport);
    gl.clearDepth(1);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(smileProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, smileVertexBuffer);
    const positionLocation = gl.getAttribLocation(smileProgram, "aPosition");
    const normalLocation = gl.getAttribLocation(smileProgram, "aNormal");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.SHORT, true, 0, geometry.positionOffset);
    gl.enableVertexAttribArray(normalLocation);
    gl.vertexAttribPointer(normalLocation, 3, gl.BYTE, true, 0, geometry.normalOffset);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, smileIndexBuffer);
    const aspect = viewport.width / viewport.height;
    const portraitLayout = viewport.width < viewport.height;
    const ambientSmileMotion = finePointer.matches;
    const progress = state.smileProgress;
    const arrival = progress * progress * (3 - 2 * progress);
    const overshoot = Math.sin(progress * Math.PI) * progress * 0.075;
    const float = ambientSmileMotion
      ? Math.sin(time * 0.00058) * 0.032 * (1 - arrival * 0.72)
      : 0;
    const initialRoll = ambientSmileMotion
      ? SMILE_SLOT_ROLL + Math.cos(time * 0.00034) * 0.05
      : SMILE_SLOT_ROLL;
    const roll = initialRoll + (SMILE_DOCK_ROLL - initialRoll) * arrival;
    const gazeWeight = 1 - arrival;
    const scale = (
      state.smileLayout.slotScale
      + (state.smileLayout.dockScale - state.smileLayout.slotScale) * arrival
    ) * (1 + overshoot);
    const anchorX = state.smileLayout.slotAnchorX * (1 - arrival);
    const anchorY = state.smileLayout.slotAnchorY
      + (state.smileLayout.dockAnchorY - state.smileLayout.slotAnchorY) * arrival;
    const smileAlpha = 1;
    metrics.smileDocked = progress >= 0.999;
    metrics.smileWidthRatio = metrics.smileDocked
      ? state.smileLayout.dockWidthRatio
      : 0;
    metrics.smileVisibleHeightRatio = metrics.smileDocked
      ? state.smileLayout.dockVisibleHeightRatio
      : 0;
    gl.uniform2f(smileUniforms.uRotation, state.smileX * gazeWeight, state.smileY * gazeWeight);
    gl.uniform1f(smileUniforms.uRoll, roll);
    gl.uniform1f(smileUniforms.uScale, scale);
    gl.uniform1f(smileUniforms.uAspect, aspect);
    gl.uniform1f(
      smileUniforms.uYOffset,
      (float - (portraitLayout ? 0.025 : 0)) * (1 - arrival),
    );
    gl.uniform2f(smileUniforms.uAnchor, anchorX, anchorY);
    gl.uniform2f(smileUniforms.uPointer, state.pointerX * 2 - 1, state.pointerY * 2 - 1);
    gl.uniform1f(smileUniforms.uPresence, arrival);
    gl.uniform1f(smileUniforms.uTime, time * 0.001);
    if (state.pointerMotion > 0.42) {
      const split = Math.min(0.0055, state.pointerMotion * 0.0055) * (1 - arrival * 0.72);
      drawSmilePass(-split, 0, [0.92, 0.12, 0.04], 0.17 * smileAlpha);
      drawSmilePass(split, 0, [0.06, 0.22, 0.82], 0.12 * smileAlpha);
    }
    drawSmilePass(0, 0, [0.15, 0.18, 0.23], smileAlpha);
  };

  const updateRects = (updateLayout = false) => {
    state.smileRect = smileSlot.getBoundingClientRect();
    state.surfaces.forEach((surface) => {
      surface.rect = surface.element.getBoundingClientRect();
    });
    if (updateLayout) updateSmileLayout();
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1);
    const width = Math.max(1, Math.round(window.innerWidth * dpr));
    const height = Math.max(1, Math.round(window.innerHeight * dpr));
    state.dpr = dpr;
    state.width = width;
    state.height = height;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    updateRects(true);
  };

  const render = (time) => {
    state.smileX += (state.smileTargetX - state.smileX) * 0.075;
    state.smileY += (state.smileTargetY - state.smileY) * 0.075;
    state.surfaces.forEach((surface) => {
      surface.trailX += (surface.x - surface.trailX) * 0.16;
      surface.trailY += (surface.y - surface.trailY) * 0.16;
      surface.hover += (surface.hoverTarget - surface.hover) * 0.11;
      surface.velocity += (surface.velocityTarget - surface.velocity) * 0.14;
      surface.velocityTarget *= 0.88;
      surface.rippleStrength += (
        surface.rippleStrengthTarget - surface.rippleStrength
      ) * 0.14;
      surface.rippleStrengthTarget *= surface.pointerActive ? 0.95 : 0.86;
      const scrollTarget = Math.abs(state.scrollImpulse) * surface.scrollScale;
      surface.scrollMotion += (scrollTarget - surface.scrollMotion) * 0.12;
      const revealTarget = surface.ready ? viewportRevealFor(surface.rect) : 0;
      if (revealTarget <= 0) surface.reveal = 0;
      else if (softwareRenderer) surface.reveal = revealTarget;
      else surface.reveal += (revealTarget - surface.reveal) * 0.09;
    });
    metrics.mediaHover = Math.max(0, ...state.surfaces.map(({ hover }) => hover));
    metrics.mediaVelocity = Math.max(0, ...state.surfaces.map(({ velocity }) => velocity));
    metrics.mediaTrailDistance = Math.max(
      0,
      ...state.surfaces.map((surface) =>
        Math.hypot(surface.x - surface.trailX, surface.y - surface.trailY),
      ),
    );
    metrics.mediaRippleStrength = Math.max(
      0,
      ...state.surfaces.map(({ rippleStrength }) => rippleStrength),
    );
    metrics.mediaRippleCount = state.surfaces.reduce(
      (count, surface) => surface.ripples.reduce(
        (surfaceCount, { active }) => surfaceCount + Number(active),
        count,
      ),
      0,
    );
    state.pointerMotion += (state.pointerMotionTarget - state.pointerMotion) * 0.1;
    state.pointerMotionTarget *= 0.9;
    drawBackground(time);
    drawMedia(time);
    drawSmile(time);
  };

  const frame = (time) => {
    state.running = false;
    if (!state.visible || document.hidden) return;
    if (state.lastFrameAt > 0) {
      const delta = time - state.lastFrameAt;
      if (delta > 0 && delta < 100) {
        metrics.frameTimes.push(delta);
        if (metrics.frameTimes.length > 360) metrics.frameTimes.shift();
      }
    }
    state.lastFrameAt = time;
    render(time);
    updateLabels();
    if (
      !softwareRenderer &&
      (finePointer.matches || time < state.settleUntil)
    ) {
      state.running = true;
      requestAnimationFrame(frame);
    }
  };

  const requestFrame = (settle = 0) => {
    if (settle > 0) state.settleUntil = Math.max(state.settleUntil, performance.now() + settle);
    if (state.running || !state.visible || document.hidden) return;
    state.running = true;
    requestAnimationFrame(frame);
  };

  let settledSurfaceCount = 0;
  const loadSurface = async (surface) => {
    surface.element.dataset.mediaState = "loading";
    try {
      const image = await loadImage(surface.url);
      surface.image = image;
      surface.texture = createTexture(image);
      surface.ready = true;
      surface.element.dataset.mediaState = "ready";
      metrics.mediaReady += 1;
      document.documentElement.dataset.liquid = "active";
      requestFrame(900);
    } catch {
      surface.failed = true;
      surface.element.dataset.mediaState = "error";
    } finally {
      settledSurfaceCount += 1;
      if (settledSurfaceCount === state.surfaces.length && metrics.mediaReady === 0) {
        document.documentElement.dataset.liquid = "static";
      }
    }
  };

  const updateGlobalPointer = (event) => {
    if (softwareRenderer || !finePointer.matches) return;
    const now = performance.now();
    if (now - state.lastInputProcessedAt < 28) return;
    state.lastInputProcessedAt = now;
    const x = Math.max(0, Math.min(1, event.clientX / window.innerWidth));
    const y = Math.max(0, Math.min(1, 1 - event.clientY / window.innerHeight));
    const elapsed = Math.max(8, now - state.lastPointerAt);
    const velocity = Math.hypot(x - state.lastPointerX, y - state.lastPointerY) / elapsed;
    state.pointerX = x;
    state.pointerY = y;
    state.pointerMotionTarget = Math.min(1, velocity * 120);
    state.lastPointerX = x;
    state.lastPointerY = y;
    state.lastPointerAt = now;

    const heroRect = hero?.getBoundingClientRect();
    const heroVisible = heroRect && heroRect.bottom > 0 && heroRect.top < window.innerHeight;
    const overSmile = Boolean(heroVisible);
    const overLiquid = state.surfaces.some(({ rect }) =>
      event.clientX >= rect.left && event.clientX <= rect.right &&
      event.clientY >= rect.top && event.clientY <= rect.bottom,
    );
    state.surfaceActive = overSmile || overLiquid;

    const localX = Math.max(-1.2, Math.min(1.2, (event.clientX / window.innerWidth) * 2 - 1));
    const localY = Math.max(-1.2, Math.min(1.2, -((event.clientY / window.innerHeight) * 2 - 1)));
    state.smileTargetX = localY * 0.18;
    state.smileTargetY = -localX * 0.3;
    requestFrame(500);
  };

  const updateMediaPointer = (surface, event) => {
    if (softwareRenderer || !finePointer.matches) return;
    const now = performance.now();
    if (now - surface.lastProcessedAt < 28) return;
    const elapsed = Math.max(16, now - surface.lastProcessedAt);
    surface.lastProcessedAt = now;
    const rect = surface.rect;
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height));
    if (!surface.pointerActive) {
      surface.x = x;
      surface.y = y;
      surface.trailX = x;
      surface.trailY = y;
      surface.pointerActive = true;
      surface.lastRippleAt = now;
    }
    const deltaX = x - surface.x;
    const deltaY = y - surface.y;
    const distance = Math.hypot(deltaX, deltaY);
    const speed = Math.min(1, distance * (980 / elapsed));
    if (distance > 0.012 && now - surface.lastRippleAt >= 28) {
      const ripple = surface.ripples[surface.nextRipple];
      ripple.active = true;
      ripple.x = x;
      ripple.y = y;
      ripple.startedAt = now * 0.001;
      ripple.radius = 0.035 + speed * 0.025;
      ripple.opacity = 0.19 + speed * 0.16;
      ripple.rotation = Math.atan2(deltaY, deltaX);
      ripple.phase = surface.nextRipple * 1.618;
      surface.nextRipple = (surface.nextRipple + 1) % surface.ripples.length;
      surface.lastRippleAt = now;
      surface.rippleFieldActive = true;
    }
    surface.x = x;
    surface.y = y;
    surface.velocityTarget = Math.min(1, distance * 7.5);
    surface.rippleStrengthTarget = Math.max(
      surface.rippleStrengthTarget,
      0.09 + speed * 0.26,
    );
    surface.hoverTarget = 1;
    requestFrame(1700);
  };

  const impactMediaEdge = (surface, event, polarity) => {
    if (!surface.edgeEnabled) return;
    const rect = surface.rect;
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height));
    const edges = [
      { distance: Math.abs(event.clientX - rect.left), normalX: -1, normalY: 0 },
      { distance: Math.abs(event.clientX - rect.right), normalX: 1, normalY: 0 },
      { distance: Math.abs(event.clientY - rect.top), normalX: 0, normalY: 1 },
      { distance: Math.abs(event.clientY - rect.bottom), normalX: 0, normalY: -1 },
    ];
    const edge = edges.reduce((closest, candidate) =>
      candidate.distance < closest.distance ? candidate : closest,
    );
    surface.edgePointX = x;
    surface.edgePointY = y;
    surface.edgeNormalX = edge.normalX;
    surface.edgeNormalY = edge.normalY;
    surface.edgePulse = 1;
    surface.edgeStartedAt = performance.now() * 0.001;
    surface.edgePolarity = polarity;
  };

  const enterMedia = (surface, event) => {
    if (softwareRenderer || !finePointer.matches) return;
    impactMediaEdge(surface, event, 1);
    updateMediaPointer(surface, event);
    requestFrame(1600);
  };

  const moveMedia = (surface, event) => {
    updateMediaPointer(surface, event);
  };

  const leaveMedia = (surface, event) => {
    if (softwareRenderer || !finePointer.matches) return;
    impactMediaEdge(surface, event, -1);
    surface.pointerActive = false;
    surface.hoverTarget = 0;
    surface.velocityTarget = 0.45;
    surface.rippleStrengthTarget = Math.max(surface.rippleStrengthTarget, 0.075);
    requestFrame(1600);
  };

  const pageObserver = new IntersectionObserver(([entry]) => {
    state.visible = entry.isIntersecting;
    if (state.visible) requestFrame(400);
  });
  pageObserver.observe(document.body);
  const resizeObserver = new ResizeObserver(() => {
    resize();
    requestFrame(400);
  });
  resizeObserver.observe(document.documentElement);
  window.addEventListener("pointermove", updateGlobalPointer, { passive: true });
  scrollMotion.subscribe(({ direction, impulse }) => {
    state.scrollDirection = direction;
    state.scrollImpulse = impulse;
    metrics.scrollImpulse = impulse;
    updateRects();
    requestFrame(450);
  });
  if (hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        state.smileProgress = self.progress;
        metrics.smileProgress = self.progress;
        updateRects();
        requestFrame(550);
      },
      onRefresh: () => {
        updateRects(true);
        requestFrame(250);
      },
    });
  }
  state.surfaces.forEach((surface) => {
    surface.element.addEventListener("pointerenter", (event) => enterMedia(surface, event), { passive: true });
    surface.element.addEventListener("pointermove", (event) => moveMedia(surface, event), { passive: true });
    surface.element.addEventListener("pointerleave", (event) => leaveMedia(surface, event), { passive: true });
    surface.element.addEventListener("pointercancel", (event) => leaveMedia(surface, event), { passive: true });
  });
  document.addEventListener("visibilitychange", () => requestFrame(200));
  finePointer.addEventListener("change", () => requestFrame(400));

  resize();
  render(performance.now());
  document.documentElement.dataset.renderer = "ready";
  document.documentElement.dataset.quality = metrics.quality;
  document.documentElement.dataset.liquid = liquidSlots.length > 0 ? "loading" : "static";
  if (rendererStatus) {
    rendererStatus.textContent = softwareRenderer
      ? "One context — compatibility tier, static GPU surfaces"
      : "One context — background, Smile and liquid ready";
  }
  updateLabels();
  requestFrame(500);
  state.surfaces.forEach((surface) => {
    void loadSurface(surface);
  });
};

init().catch((error) => {
  console.error(error);
  fail("CSS and image fallback — shared renderer failed");
});
