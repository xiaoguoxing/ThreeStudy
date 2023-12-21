// utility to get screensize based on body pseudo element
import { getScreenSize } from './index';

let size = getScreenSize();
export const isTouch = !document.body.classList.contains('no-touch');

export function screenSize() {
    return size;
}

export function updateScreenSize() {
    size = getScreenSize();
}
