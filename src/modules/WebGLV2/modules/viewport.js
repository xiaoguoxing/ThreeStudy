import dispatcher from './dispatcher';
import { screenSize, updateScreenSize } from '@/utils/screen';
import { debounce } from '@/utils';

class Viewport {
    constructor() {
        this.width = this.calculateWidth();
        this.height = this.calculateHeight();
        this.ratio = this.width / this.height;
        this.onResize();
        window.addEventListener('resize', debounce(this.onResize, 100));
    }

    calculateWidth() {
        return window.innerWidth;
    }

    calculateHeight() {
        return window.innerHeight;
    }

    onResize = () => {
        this.width = this.calculateWidth();
        this.height = this.calculateHeight();
        this.ratio = this.width / this.height;

        updateScreenSize();

        dispatcher.trigger(
            { name: 'resize', fireAtStart: true},
            {
                width: this.width,
                height: this.height,
                ratio: this.ratio,
            }
        );
    };
}

export const viewport = new Viewport();
