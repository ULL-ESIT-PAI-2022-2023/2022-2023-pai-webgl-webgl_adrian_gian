export interface ProgramInformation {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: number;
    vertexColor?: number;
    textureCoord?: number;
    vertexNormal?: number;
  };
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation;
    modelViewMatrix: WebGLUniformLocation;
    uSampler?: WebGLUniformLocation;
    normalMatrix?: WebGLUniformLocation;
  };
}

export interface BufferInformation {
  position: WebGLBuffer;
  color?: WebGLBuffer;
  textureCoord?: WebGLBuffer;
  normal?: WebGLBuffer;
  index: WebGLBuffer;
}