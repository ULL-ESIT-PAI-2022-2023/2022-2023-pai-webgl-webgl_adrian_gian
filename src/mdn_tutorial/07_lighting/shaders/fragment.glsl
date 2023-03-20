/**
 * The fragment shader needs to be updated to take into account the lighting
 * value calculated.
 */

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;

void main(void) {
  highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

  /**
   * Before setting the color of the fragment, we multiply the texel's
   * color by the lighting value to adjust the texel's color to take into
   * account the effect of our light sources.
   */
  gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}