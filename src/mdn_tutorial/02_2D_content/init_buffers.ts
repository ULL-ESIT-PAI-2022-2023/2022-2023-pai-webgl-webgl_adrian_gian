import { BufferInformation } from './types';

export default function initBuffers(gl: WebGLRenderingContext): BufferInformation {
  return {
    vertex: initVertexBuffer(gl),
  };
}

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