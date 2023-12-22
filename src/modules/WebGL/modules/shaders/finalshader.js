import { Vector2 } from 'three';
import vertexShader from './final.vs?raw';
import fragmentShader from './final.fs?raw';

const FinalShader = {
    uniforms: {
        tDiffuse: { value: null },
        uResolution: { value: new Vector2() },
    },
    vertexShader:vertexShader,
    fragmentShader:fragmentShader,
    defines: {
        FXAA: true,
    },
};

export { FinalShader };
