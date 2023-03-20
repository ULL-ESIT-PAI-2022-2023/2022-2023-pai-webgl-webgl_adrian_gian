export interface ProgramInformation {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: number;
    vertexColor?: number;
    textureCoord?: number;
  };
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation;
    modelViewMatrix: WebGLUniformLocation;
    uSampler?: WebGLUniformLocation;
  };
}

export interface BufferInformation {
  position: WebGLBuffer;
  color?: WebGLBuffer;
  textureCoord?: WebGLBuffer;
  index: WebGLBuffer;
}