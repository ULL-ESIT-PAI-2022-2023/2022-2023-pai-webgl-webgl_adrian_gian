import { BufferInformation } from './types';

export default function initBuffers(gl: WebGLRenderingContext): BufferInformation {
  const vertex = initVertexBuffer(gl);
  const textureCoord = initTextureBuffer(gl);
  const index = initIndexBuffer(gl);
  const normal = initNormalBuffer(gl);
  return {
    vertex,
    normal,
    textureCoord,
    index,
  };
}


/**
 * @description Creates a js array with four vertices, one for each corner of the square.
 * Then creates a WebGLBuffer and fills it with the position data.
 *
 * @param gl The WebGL context to use
 * @returns A WebGLBuffer containing the position data
 */
function initVertexBuffer(gl: WebGLRenderingContext): WebGLBuffer {
  // Create a buffer for the square's positions.
  const vertexBuffer = gl.createBuffer() as WebGLBuffer;

  // Select the vertexBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Array with (x, y z) coordinates for each vertex
  const vertices = [
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0,
  ];

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  return vertexBuffer;
}

/**
 * @description Creates a js array with four colors (rgba values), one for each vertex.
 * Then creates a WebGLBuffer and fills it with the color data.
 *
 * @param gl The WebGL context to use
 * @returns A WebGLBuffer containing the color data
 */
export function initColorBuffer(gl: WebGLRenderingContext): WebGLBuffer {
  const faceColors = [
    [1.0, 1.0, 1.0, 1.0], // Front face: white
    [1.0, 0.0, 0.0, 1.0], // Back face: red
    [0.0, 1.0, 0.0, 1.0], // Top face: green
    [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0], // Right face: yellow
    [1.0, 0.0, 1.0, 1.0], // Left face: purple
  ];

  // Convert the array of colors into a table for all the vertices.
  const colors = [];
  for (const color of faceColors) {
    colors.push(...color, ...color, ...color, ...color);
  }

  const colorBuffer: WebGLBuffer = gl.createBuffer() as WebGLBuffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return colorBuffer;
}

/**
 * @description Creates indexes arrays that define each face like a pair of
 *   triangles, specifying each triangle's vertices as an index into the cube's
 *   vertex arrays.
 * Thus the cube is described as a collection of 12 triangles.
 *
 * @param gl The WebGL context to use
 * @returns A WebGLBuffer containing the data for the indexes of the cube
 */
function initIndexBuffer(gl: WebGLRenderingContext): WebGLBuffer {
  const indexBuffer: WebGLBuffer = gl.createBuffer() as WebGLBuffer;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indexes = [
    // front
    0, 1, 2,
    0, 2, 3,

    // back
    4, 5, 6,
    4, 6, 7,

    // top
    8, 9, 10,
    8, 10, 11,

    // bottom
    12, 13, 14,
    12, 14, 15,

    // right
    16, 17, 18,
    16, 18, 19,

    // left
    20, 21, 22,
    20, 22, 23,
  ];

  // Now send the element array to GL

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indexes),
    gl.STATIC_DRAW
  );

  return indexBuffer;
}

/**
 * @description Creates a WebGL buffer to store the coordinates for each face
 * and bind the buffer as the current ARRAY_BUFFER.
 *
 * @param gl The WebGL context to use
 * @returns A WebGLBuffer containing the texture coordinates for the cube
 */
function initTextureBuffer(gl: WebGLRenderingContext): WebGLBuffer {
  const textureCoordBuffer = gl.createBuffer() as WebGLBuffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  const textureCoordinates: number[] = [
    // Front
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Back
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Top
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Bottom
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Right
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Left
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  ];

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoordinates),
    gl.STATIC_DRAW
  );

  return textureCoordBuffer;
}

/**
 * @description Creates a WebGL buffer to store the normal vectors for each face
 * and bind the buffer as the current ARRAY_BUFFER.
 *
 * @param gl The WebGL context to use
 * @returns A WebGLBuffer containing the normal vectors for the cube
 */
function initNormalBuffer(gl: WebGLRenderingContext): WebGLBuffer {
  const normalBuffer = gl.createBuffer() as WebGLBuffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  const vertexNormals = [
    // Front
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    // Back
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
    // Top
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    // Bottom
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
    // Right
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    // Left
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
  ];

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertexNormals),
    gl.STATIC_DRAW
  );

  return normalBuffer;
}