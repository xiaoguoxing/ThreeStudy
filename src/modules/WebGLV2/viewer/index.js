import {Group} from "three";
import frontpage from './frontpage.js'

const arr = [
    {
        Constructor: frontpage,
        name: 'Frontpage',
        el: ['#introText'],
        // theme: 'light',
        fog: { near: 15, far: 36 },
    }
]
class loadViewer{
    instance = []
    newView = new Group()
    constructor() {
        this.init()
    }
    init(){
        this.newView.name = 'controller'
        this.instance = arr.map(i=>{
            let {Constructor,...data} = i
            let instance = new Constructor(data)
            this.newView.add(instance)
            return instance
        })
    }
    destroyView(){
        this.instance.forEach(i=>{
            i?.destroy()
        })
    }
}
export default  loadViewer
