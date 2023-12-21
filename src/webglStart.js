/**
 * This file is part of the Helsedirektoratet Cannabis 2020 application.
 *
 * (c) APT AS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import renderer from '@webGL/renderer';
import scene from '@webGL/scene';
import camera from '@webGL/camera';
import * as assetList from '@webGL/assetlist';
import WebGL from '@webGL/index';


export default function (dom) {
    const onProgress = (p) => {
        console.log(Math.round(p * 100))
    };
    const onComplete = () => {
        // avoid jank
        // loader.complete(() => {
        //     controller.register(sections);
        //     new WebGL();
        // });
        // new WebGL()
        console.log('完成');
    };

    // initial renderer to get the correct color
    renderer.render(scene, camera);
    dom.appendChild(renderer.domElement)
    assetList.loadAll(renderer, onProgress, onComplete);
}
