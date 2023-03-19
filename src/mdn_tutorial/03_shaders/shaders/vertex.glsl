attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

/**
 * We pass the color from the vertex shader to the fragment shader
 * using a varying. This is a special variable that is declared by
 * the vertex and can be read from the fragment shader.
 */
varying lowp vec4 vColor;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vColor = aVertexColor;
}