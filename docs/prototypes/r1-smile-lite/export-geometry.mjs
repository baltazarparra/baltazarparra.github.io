import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

globalThis.ProgressEvent ??= class ProgressEvent {};

const directory = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(directory, "../../../v2/public/smile.glb");
const outputPath = resolve(directory, "smile-lite.bin");
const source = await readFile(sourcePath);
const sourceBuffer = source.buffer.slice(
  source.byteOffset,
  source.byteOffset + source.byteLength,
);

const gltf = await new Promise((resolveLoad, rejectLoad) => {
  new GLTFLoader().parse(sourceBuffer, "", resolveLoad, rejectLoad);
});

gltf.scene.updateMatrixWorld(true);
const mesh = [];
gltf.scene.traverse((node) => {
  if (node.isMesh) mesh.push(node);
});

if (mesh.length !== 1) {
  throw new Error(`Expected one mesh, found ${mesh.length}`);
}

const geometry = mesh[0].geometry.clone();
geometry.applyMatrix4(mesh[0].matrixWorld);
if (!geometry.getAttribute("normal")) geometry.computeVertexNormals();

const positions = geometry.getAttribute("position");
const normals = geometry.getAttribute("normal");
const index = geometry.index;
if (!positions || !normals || !index) {
  throw new Error("Smile geometry must contain positions, normals and indices");
}

let minX = Infinity;
let minY = Infinity;
let minZ = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;
let maxZ = -Infinity;

for (let vertex = 0; vertex < positions.count; vertex += 1) {
  minX = Math.min(minX, positions.getX(vertex));
  minY = Math.min(minY, positions.getY(vertex));
  minZ = Math.min(minZ, positions.getZ(vertex));
  maxX = Math.max(maxX, positions.getX(vertex));
  maxY = Math.max(maxY, positions.getY(vertex));
  maxZ = Math.max(maxZ, positions.getZ(vertex));
}

const center = [
  (minX + maxX) * 0.5,
  (minY + maxY) * 0.5,
  (minZ + maxZ) * 0.5,
];
const largestAxis = Math.max(maxX - minX, maxY - minY, maxZ - minZ, 0.001);
const halfAxis = largestAxis * 0.5;
const quantizedPositions = new Int16Array(positions.count * 3);
const quantizedNormals = new Int8Array(normals.count * 3);

for (let vertex = 0; vertex < positions.count; vertex += 1) {
  const offset = vertex * 3;
  quantizedPositions[offset] = Math.round(
    Math.max(-1, Math.min(1, (positions.getX(vertex) - center[0]) / halfAxis)) *
      32767,
  );
  quantizedPositions[offset + 1] = Math.round(
    Math.max(-1, Math.min(1, (positions.getY(vertex) - center[1]) / halfAxis)) *
      32767,
  );
  quantizedPositions[offset + 2] = Math.round(
    Math.max(-1, Math.min(1, (positions.getZ(vertex) - center[2]) / halfAxis)) *
      32767,
  );
  quantizedNormals[offset] = Math.round(normals.getX(vertex) * 127);
  quantizedNormals[offset + 1] = Math.round(normals.getY(vertex) * 127);
  quantizedNormals[offset + 2] = Math.round(normals.getZ(vertex) * 127);
}

if (index.count > 0 && Math.max(...index.array) > 65535) {
  throw new Error("Smile geometry exceeds Uint16 index range");
}

const indices = new Uint16Array(index.count);
indices.set(index.array);
const headerBytes = 32;
const positionBytes = Buffer.from(quantizedPositions.buffer);
const normalBytes = Buffer.from(quantizedNormals.buffer);
const normalPadding = normalBytes.byteLength % 2;
const indexBytes = Buffer.from(indices.buffer);
const header = Buffer.alloc(headerBytes);
header.write("SMIL", 0, "ascii");
header.writeUInt32LE(1, 4);
header.writeUInt32LE(positions.count, 8);
header.writeUInt32LE(index.count, 12);
header.writeUInt32LE(positionBytes.byteLength, 16);
header.writeUInt32LE(normalBytes.byteLength, 20);
header.writeUInt32LE(indexBytes.byteLength, 24);
header.writeUInt32LE(normalPadding, 28);

const output = Buffer.concat([
  header,
  positionBytes,
  normalBytes,
  Buffer.alloc(normalPadding),
  indexBytes,
]);
await writeFile(outputPath, output);

console.log(
  JSON.stringify(
    {
      sourceBytes: source.byteLength,
      outputBytes: output.byteLength,
      reduction: `${((1 - output.byteLength / source.byteLength) * 100).toFixed(1)}%`,
      vertices: positions.count,
      indices: index.count,
    },
    null,
    2,
  ),
);
