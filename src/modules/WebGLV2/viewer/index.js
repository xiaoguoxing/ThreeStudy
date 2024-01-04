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
export default function (){
    let newView = new Group()
    newView.name = 'controller'
    arr.forEach(i=>{
        let {Constructor,...data} = i
        let newC = new Constructor(data)
        newView.add(newC)
    })
    return newView
}
