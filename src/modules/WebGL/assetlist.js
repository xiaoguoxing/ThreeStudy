// import { RepeatWrapping, MirroredRepeatWrapping } from 'three';

import assets from './assetloader.js';
import settings from './modules/settings'
import {SRGBColorSpace} from "three";

const {BASEPATH} = settings
// models

// import tableWithObjects from 'gltf/table-with-objects.glb';


// texture

//import brainRightTexture from 'weedensenteret/brain-right-texture.jpg';

// import tableTexture from '@statiBASEPATH+ctable-bake.jpg';
// import kolbeTexture from '@statiBASEPATH+ckolbe-ext-texture.jpg';
// import brownieTex from '@statiBASEPATH+cbrownie-tex.jpg';
// import dryppeflaskeParticlesCombined from 'weedensenteret/dryppflaske-particles-combined.jpg';
// import bongTex from '@statiBASEPATH+cbong-tex.jpg';
// import weedBowlTex from '@statiBASEPATH+cweed-bowl-tex.jpg';
// import earthTexture from 'weedensenteret/earth-texture.jpg';
// import earthTexture from '@statiBASEPATH+cearth-texture-2k.jpg';
// import planeTexture from '@statiBASEPATH+cplane-texture.jpg';
// import jointTexture from '@statiBASEPATH+cjoint-texture.jpg';
// import rgbaNoiseTexture from 'weedensenteret/rgba_noise_256.png';
// import weedbagTexture from '@statiBASEPATH+cweedbag-tex.jpg';

// envmap
/*import front from '@statiBASEPATH+cenvmap_front.jpg';
import back from '@statiBASEPATH+cenvmap_back.jpg';
import left from '@statiBASEPATH+cenvmap_left.jpg';
import right from '@statiBASEPATH+cenvmap_right.jpg';
import top from '@statiBASEPATH+cenvmap_top.jpg';
import bottom from '@statiBASEPATH+cenvmap_bottom.jpg';*/

// manifest
const manifest = [
    {
        url: BASEPATH + 'brain.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: BASEPATH + 'thc.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: BASEPATH + 'bong.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: BASEPATH + 'cbd.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: BASEPATH + 'denied.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: BASEPATH + 'molecule.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: BASEPATH + 'flask.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: BASEPATH + 'leaf.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: BASEPATH + 'plant2.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: BASEPATH + 'table.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: BASEPATH + 'earth.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: BASEPATH + 'joint.glb',
        draco: true,
        type: 'gltf',
    },
    {
        url: BASEPATH + 'weedbag.glb',
        draco: true,
        type: 'gltf',
    },
    {
        url: BASEPATH + 'brain-left-texture2.jpg',
        type: 'texture',
        settings: {
            colorSpace: SRGBColorSpace
        }
    },
    {
        url: BASEPATH + 'plant-texture.jpg',
        type: 'texture',
        settings: {
            colorSpace: SRGBColorSpace
        }
    },
    {
        url: BASEPATH + 'plant-alpha.png',
        type: 'texture',
        settings: {
            colorSpace: SRGBColorSpace
        }
    },
    {
        url: BASEPATH + 'stem-bud-texture.jpg',
        type: 'texture',
        settings: {
            colorSpace: SRGBColorSpace
        }
    }
];

export function loadAll(renderer, onProgress, onComplete) {
    assets.setRenderer(renderer);

    manifest.forEach((item) => {
        assets.queue(item);
    });

    assets.progress(onProgress);
    assets.completed(onComplete);
    assets.load();
}
