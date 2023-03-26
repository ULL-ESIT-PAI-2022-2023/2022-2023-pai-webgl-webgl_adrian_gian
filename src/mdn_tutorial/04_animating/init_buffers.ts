import { BufferInformation } from './types';

export default function initBuffers(gl: WebGLRenderingContext): BufferInformation {
  const vertex = initVertexBuffer(gl);
  const color = initColorBuffer(gl);
  return {
    vertex,
    color
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

  // Now create an array of positions for the square.
  const vertices: number[] = [ // x, y
    1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    -1.0, -1.0
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
function initColorBuffer(gl: WebGLRenderingContext): WebGLBuffer {
  const colors: number[] = [
    1.0, 1.0, 1.0, 1.0, // white
    1.0, 0.0, 0.0, 1.0, // red
    0.0, 1.0, 0.0, 1.0, // green
    0.0, 0.0, 1.0, 1.0, // blue
  ];

  const colorBuffer: WebGLBuffer = gl.createBuffer() as WebGLBuffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return colorBuffer;
}