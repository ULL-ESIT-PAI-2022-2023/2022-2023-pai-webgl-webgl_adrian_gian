/**
 * The fragment code determine the color of that pixel by figuring out which
 * texel (that is, the pixel from within the shape's texture) to apply to the
 * pixel, getting that texel's color, then applying the appropriate lighting
 * to the color.
 *
 * In this case, we're returning white every time, since we're just drawing a
 * white square, with no lighting in use.
 */
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}