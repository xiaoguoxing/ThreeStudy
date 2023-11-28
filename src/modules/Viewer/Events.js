export class EventBus{
  eventList = {}
  constructor() {

  }
  on(eventName,fn){
    this.eventList[eventName] = fn
  }
  emit(eventName,prop){
    if(this.eventList[eventName])this.eventList[eventName](prop);
  }
}
export default {
  animate: 'animate',
  dispose: 'dispose',
  orbitChange: 'orbitChange',
  load: {
    start: 'load:start',
    processing: 'load:processing',
    finish: 'load:finish',
  },
  click: {
    raycaster: 'click:raycaster',
  },
  dblclick: {
    raycaster: 'dblclick:raycaster',
  },
  mousemove: {
    raycaster: 'mousemove:raycaster',
  },
  resize: 'resize',
};
