export interface ProgramInformation {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: number;
    vertexColor: number;
  };
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation;
    modelViewMatrix: WebGLUniformLocation;
  };
}

export interface BufferInformation {
  vertex: WebGLBuffer;
  color: WebGLBuffer;
  index: WebGLBuffer;
}