import * as THREE from 'three'
export default class Floors{
    viewer = null
    width = 5
    height = 5
    constructor(viewer) {
        this.viewer = viewer
        this.#init()
    }
    #init(){
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(this.width, this.height),
            new THREE.MeshPhongMaterial({ color: 0xbbbbbb, depthWrite: false })
        )
        ground.rotation.x = - Math.PI / 2;
        ground.receiveShadow = true;
        this.viewer.scene.add(ground);
    }
    addGrid(
        size = 5,
        divisions = 20,
        colorCenterLine = 0x888888,
        colorGrid = 0x888888
    ) {
        const grid = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);
        this.viewer.scene.add(grid);
    }
}
