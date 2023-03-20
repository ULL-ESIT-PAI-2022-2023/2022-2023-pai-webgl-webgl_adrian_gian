/*
 * We update the vertex so it generates a shading value for each vertex, based
 * on the ambient loghting as well as the directional lighting
 */

attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vTextureCoord = aTextureCoord;

  // Apply lighting effect

  highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
  highp vec3 directionalLightColor = vec3(1, 1, 1);
  highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

  /*
   * The first thing we do is transform the normal based on the current
   * orientation of the cube.
   */
  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

  /**
   * Then we calculate the amount of directional light that needs to be applied
   * to the vertex. Max is used to ensure that the value is not negative.
   */
  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);

  /**
   * Now we can generate the lighting value byy taking the ambient light and
   * adding the product of the directional light's color and the amount of
   * directional light that is applied.
   */
  vLighting = ambientLight + (directionalLightColor * directional);
}