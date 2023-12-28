

import assets from './assetloader';
import settings from './modules/settings'
import {SRGBColorSpace} from "three";

const {BASEPATH} = settings

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
