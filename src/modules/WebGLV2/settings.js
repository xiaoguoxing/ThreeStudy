import { Color } from 'three';

const MAX_DPR = 2;

export default {
    CAMERA_FOV: 35,
    CAMERA_NEAR: 0.1,
    CAMERA_FAR: 1000,
    ENABLE_FXAA: true,
    ENABLE_CONTROLS: false,
    CLEAR_COLOR: new Color('#cbe0e0'),
    DPR: Math.min(window.devicePixelRatio || 1, MAX_DPR),
    BASEPATH: '/weedensenteret/',
    SHOW_GUI: false,
    THEMES: {
        dark: new Color('#11202c'),
        light: new Color('#cbe0e0'),
        grey: new Color('#f8f8f8'),
    },
};
