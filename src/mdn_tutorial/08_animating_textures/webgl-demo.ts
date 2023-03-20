import { BufferInformation, ProgramInformation } from './types';
import initBuffers from './init_buffers.js';
import drawScene from './draw_scene.js';

let copyVideo: boolean = false;

/**
 * @description Initialize a shader program, so WebGL knows how to draw our data.
 *
 * @param gl The WebGL Context.
 * @param vsSource Vertex shader source.
 * @param fsSource Fragment shader source.
 * @returns The shader program. If it fails, it returns null.
 */
function initShaderProgram(gl: WebGLRenderingContext, vsSource: string,
  fsSource: string): WebGLProgram | null {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource) as WebGLShader;
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource) as WebGLShader;

  // Create the shader program
  const shaderProgram = gl.createProgram() as WebGLProgram;
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }

  return shaderProgram;
}

/**
 * @description Creates a shader of the given type, uploads the source and
 * compiles it.
 *
 * @param gl The WebGL Context.
 * @param type The type of shader, VERTEX_SHADER or FRAGMENT_SHADER.
 * @param source The source code for the shader.
 * @returns The shader. If it fails, it returns null.
 */
function loadShader(gl: WebGLRenderingContext, type: GLenum,
  source: string): WebGLShader | null {
  const shader = gl.createShader(type) as WebGLShader;

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * @description Initialize a texture and load an image.
 *   When the image finished loading copy it into the texture.
 *
 * @param gl The WebGL Context.
 */
function initTexture(gl: WebGLRenderingContext): WebGLTexture {
  const texture = gl.createTexture() as WebGLTexture;
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because video has to be download over the internet
  // they might take a moment until it's ready so
  // put a single pixel in the texture so we can
  // use it immediately.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  // Turn off mips and set wrapping to clamp to edge so it
  // will work regardless of the dimensions of the video.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  return texture;
}

/**
 * @description Update the texture with the contents of the video element.
 *
 * @param gl The WebGL Context.
 * @param texture The texture to update.
 * @param video The video element containing the video texture.
 */
function updateTexture(gl: WebGLRenderingContext, texture: WebGLTexture, video: HTMLVideoElement): void {
  const level = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    srcFormat,
    srcType,
    video
  );
}

/**
 * @description Creates a video element and sets it up (auto-played, muted and looped).
 *
 * @param url The URL of the video to load.
 * @param videoObject A video object that will be used to copy the video texture.
 * @param videoObject.copyVideo Whether the video texture should be copied or not.
 * @returns The video element created.
 */
function setupVideo(url: string): HTMLVideoElement {
  const video = document.createElement("video");

  let playing = false;
  let timeupdate = false;

  video.playsInline = true;
  video.muted = true;
  video.loop = true;

  function checkReady() {
    if (playing && timeupdate) {
      copyVideo = true;
    }
  }

  // Waiting for these 2 events ensures
  // there is data in the video
  video.addEventListener(
    "playing",
    () => {
      playing = true;
      checkReady();
    },
    true
  );

  video.addEventListener(
    "timeupdate",
    () => {
      timeupdate = true;
      checkReady();
    },
    true
  );

  video.src = url;
  video.play();

  return video;
}

async function main(): Promise<void> {
  let cubeRotation: number = 0.0;
  let deltaTime: number = 0;
  // will set to true when video can be copied to texture

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

  // ------------------------ Second part of the tutorial ------------------------
  const vsSource = await fetch("shaders/vertex.glsl").then((res) => res.text());
  const fsSource = await fetch("shaders/fragment.glsl").then((res) => res.text());

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource) as WebGLProgram;

  const programInfo: ProgramInformation = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
      textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix") as WebGLUniformLocation,
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix") as WebGLUniformLocation,
      normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix") as WebGLUniformLocation,
      uSampler: gl.getUniformLocation(shaderProgram, "uSampler") as WebGLUniformLocation,
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers: BufferInformation = initBuffers(gl);

  const texture: WebGLTexture = initTexture(gl);
  const video: HTMLVideoElement = setupVideo("video/ibai_ebau_motivational.mp4");

  // Flip image pixels into the bottom-to-top order that WebGL expects.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  let then = 0;
  // Draw the scene repeatedly
  function render(now: number): void {
    now *= 0.001; // convert to seconds
    deltaTime = now - then;
    then = now;

    if (copyVideo) {
      updateTexture(gl, texture, video);
    }

    drawScene(gl, programInfo, buffers, texture, cubeRotation);
    cubeRotation += deltaTime;

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}


main();