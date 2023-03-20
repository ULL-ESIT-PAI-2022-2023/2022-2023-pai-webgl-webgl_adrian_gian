/**
 * Instead if fetching the vertex color, we're fetching the texture coordinates
 * and passing them to the vertex shader.
 * This will indicate the location within the texture corresponding to the
 * vertex.
 */

attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vTextureCoord = aTextureCoord;
}