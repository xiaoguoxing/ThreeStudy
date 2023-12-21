// import { RepeatWrapping, MirroredRepeatWrapping } from 'three';

import assets from './assetloader';

// models

// import tableWithObjects from 'gltf/table-with-objects.glb';


// texture

//import brainRightTexture from 'weedensenteret/brain-right-texture.jpg';

// import tableTexture from '@static/weedensenteret/table-bake.jpg';
// import kolbeTexture from '@static/weedensenteret/kolbe-ext-texture.jpg';
// import brownieTex from '@static/weedensenteret/brownie-tex.jpg';
// import dryppeflaskeParticlesCombined from 'weedensenteret/dryppflaske-particles-combined.jpg';
// import bongTex from '@static/weedensenteret/bong-tex.jpg';
// import weedBowlTex from '@static/weedensenteret/weed-bowl-tex.jpg';
// import earthTexture from 'weedensenteret/earth-texture.jpg';
// import earthTexture from '@static/weedensenteret/earth-texture-2k.jpg';
// import planeTexture from '@static/weedensenteret/plane-texture.jpg';
// import jointTexture from '@static/weedensenteret/joint-texture.jpg';
// import rgbaNoiseTexture from 'weedensenteret/rgba_noise_256.png';
// import weedbagTexture from '@static/weedensenteret/weedbag-tex.jpg';

// envmap
/*import front from '@static/weedensenteret/envmap_front.jpg';
import back from '@static/weedensenteret/envmap_back.jpg';
import left from '@static/weedensenteret/envmap_left.jpg';
import right from '@static/weedensenteret/envmap_right.jpg';
import top from '@static/weedensenteret/envmap_top.jpg';
import bottom from '@static/weedensenteret/envmap_bottom.jpg';*/

// manifest
const manifest = [
    {
        url: '/weedensenteret/brain.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: '/weedensenteret/thc.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: '/weedensenteret/bong.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: '/weedensenteret/cbd.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: '/weedensenteret/denied.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: '/weedensenteret/molecule.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: '/weedensenteret/flask.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: '/weedensenteret/leaf.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: '/weedensenteret/plant2.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: '/weedensenteret/table.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: '/weedensenteret/earth.glb',
        type: 'gltf',
        draco: true,
    },
    {
        url: '/weedensenteret/joint.glb',
        draco: true,
        type: 'gltf',
    },
    {
        url: '/weedensenteret/weedbag.glb',
        draco: true,
        type: 'gltf',
    },
    {
        url: '/weedensenteret/brain-left-texture2.jpg',
        type: 'texture',
    },
    {
        url: '/weedensenteret/plant-texture.jpg',
        type: 'texture',
    },
    {
        url: '/weedensenteret/plant-alpha.png',
        type: 'texture',
    },
    {
        url: '/weedensenteret/stem-bud-texture.jpg',
        type: 'texture',
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
