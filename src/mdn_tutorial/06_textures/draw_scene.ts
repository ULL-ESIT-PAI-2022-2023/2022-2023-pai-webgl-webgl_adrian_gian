import { BufferInformation, ProgramInformation } from './types';

export default function drawScene(gl: WebGLRenderingContext,
  programInfo: ProgramInformation, buffers: BufferInformation,
  texture: WebGLTexture, cubeRotation: number) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque. (r, g, b, a)
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is used to simulate the
  // distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height ratio that matches the
  // display size of the canvas and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 0.1;      // minimum distance from camera to visualized objects
  const zFar = 100.0;     // maximum distance from camera to visualized objects
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.
  mat4.translate(
    modelViewMatrix,    // destination matrix
    modelViewMatrix,    // matrix to translate
    [-0.0, 0.0, -6.0]   // amount to translate. (x, y, z)
  );

  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation, // amount to rotate in radians
    [0, 0, 1]
  ); // axis to rotate around (Z)
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation * 0.7, // amount to rotate in radians
    [0, 1, 0]
  ); // axis to rotate around (Y)
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation * 0.3, // amount to rotate in radians
    [1, 0, 0]
  ); // axis to rotate around (X)


  // Tell WebGL how to pull out the positions and colors from the buffers
  setAttribute(gl, buffers.vertex, programInfo.attribLocations.vertexPosition, 3);
  setAttribute(gl, buffers.textureCoord as WebGLBuffer,
    programInfo.attribLocations.textureCoord as number, 2);

  // Tell WebGL which indexes to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);

  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniformLocations.uSampler as WebGLUniformLocation, 0);

  const vertexCount = 36;
  const type = gl.UNSIGNED_SHORT;
  const offset = 0;
  gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
}

/**
 * @description Tell WebGL how to pull out the attribute from the buffer
 *  into the attribute given by the index.
 *
 * @param gl The WebGL context
 * @param buffer  The buffer information
 * @param vertexIndex The index of the attribute
 * @param numComponents How many values are pulled out per iteration
 */
function setAttribute(gl: WebGLRenderingContext, buffer: WebGLBuffer,
  vertexIndex: number, numComponents: number): void {
  const type = gl.FLOAT;      // the data in the buffer is 32bit floats
  const normalize = false;    // don't normalize
  const stride = 0;           // how many bytes to get from one set of values to the next

  // 0 -> use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(
    vertexIndex,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(vertexIndex);
}