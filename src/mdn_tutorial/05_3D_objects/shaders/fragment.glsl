/**
 * In order to pick up the interpolated color for each pixel, we
 * need to change the fragment shader to fetch the value from the
 * vColor varying.
 *
 * Each fragment receives the interpolated color based on its
 * position relative to the vertex positions instead of a fixed value.
 */
varying lowp vec4 vColor;

void main(void) {
  gl_FragColor = vColor;
}