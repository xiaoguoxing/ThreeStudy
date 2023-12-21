
import vertexShader from './rgb_shift.vs?raw';
import fragmentShader from './rgb_shift.fs?raw';

const RGBShift = {
    uniforms: {
        tDiffuse: { value: null },
        uNoiseTexture: { value: null },
        uTime: { value: 0 },
        shiftAmount: { value: 0 },
        speed: { value: 0 },
        waveFactor: { value: 0 },
        enabled: { value: true },
    },
    vertexShader,
    fragmentShader,
};

export { RGBShift };
