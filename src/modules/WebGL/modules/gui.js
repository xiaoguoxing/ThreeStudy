import { Pane } from 'tweakpane';
import settings from './settings';

class GUI {
    constructor() {
        this.colors = {};
        this.pane = new Pane();
        this.pane.element.style.display = settings.SHOW_GUI ? 'visible' : 'none';

        window.addEventListener('keydown', (evt) => {
            const key = evt.keyCode;
            if ((key === 100 || key === 68) && evt.shiftKey) {
                const visible = this.pane.element.style.display !== 'none';
                if (!visible) {
                    this.pane.element.style.display = 'block';
                } else {
                    this.pane.element.style.display = 'none';
                }
            }
        });
    }

    folder(options = {}) {
        return this.pane.addFolder(options);
    }

    add(obj, prop, options = {}, folder) {
        const p = folder || this.pane;
        return p.addBinding(obj, prop, options);
    }

    guiColor(param, obj, folder) {
        this.colors[param] = obj[param].getStyle();

        folder.addInput(this.colors, param).on('change', (val) => {
            obj[param].setStyle(this.colors[param]);
        });
    }
}

export default new GUI();
