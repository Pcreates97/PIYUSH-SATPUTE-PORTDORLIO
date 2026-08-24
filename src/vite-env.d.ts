/// <reference types="vite/client" />

declare module '*.glb' {
  const src: string;
  export default src;
}

declare module 'meshline' {
  export class MeshLineGeometry {
    setPoints(points: any[]): void;
    points: any[];
  }
  export class MeshLineMaterial {
    constructor(parameters?: any);
    color: any;
    depthTest: boolean;
    resolution: any;
    useMap: number;
    map: any;
    repeat: any;
    lineWidth: number;
  }
}
