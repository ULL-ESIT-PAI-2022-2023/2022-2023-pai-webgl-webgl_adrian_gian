function main(): void {
  const canvas: HTMLCanvasElement = document.getElementById('glcanvas') as HTMLCanvasElement;

  // Initialize the GL context
  const gl: WebGLRenderingContext = canvas.getContext('webgl') as WebGLRenderingContext;

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      'Unable to initialize WebGL. Your browser or machine may not support it.'
    );
    return;
  }

  // Set clear color to black, fully opaque (rgba)
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);
}

main();