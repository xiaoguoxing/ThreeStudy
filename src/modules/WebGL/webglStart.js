/**
 * This file is part of the Helsedirektoratet Cannabis 2020 application.
 *
 * (c) APT AS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import renderer from './modules/renderer';
import scene from './modules/scene';
import camera from './modules/camera';
import * as assetList from './modules/assetlist';
import WebGL from './modules/index';


export default function (dom) {
    const onProgress = (p) => {
        // console.log(Math.round(p * 100))
    };
    const onComplete = () => {
        // avoid jank
        // loader.complete(() => {
        //     controller.register(sections);
        //     new WebGL();
        // });
        new WebGL()
        console.log('完成');
    };
    renderer.render(scene, camera);
    dom.appendChild(renderer.domElement)
    assetList.loadAll(renderer, onProgress, onComplete);
}
