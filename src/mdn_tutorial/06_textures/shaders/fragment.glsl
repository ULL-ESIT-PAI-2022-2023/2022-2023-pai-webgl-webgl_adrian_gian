/**
 * Instead of assigning a color value to the fragment's color, the fragment's
 * color is computed by fethcing the texel based of `vTextureCoord` which
 * is interpolated between vertices.
 */

varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
  gl_FragColor = texture2D(uSampler, vTextureCoord);
}