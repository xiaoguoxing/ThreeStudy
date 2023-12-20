
export function findChildren (object3D, callback){
  const children= [];
  object3D.traverse(obj => children.push(obj));
  const result = children.find(callback);
  if (result !== undefined) {
    return result;
  } else {
    return null;
  }
}

export function findParent (object3d, callback)  {
  let parent = object3d;
  while (!callback(parent)) {
    parent = parent.parent;
    if (parent === null) {
      return null;
    }
  }
  return parent;
}
export function checkNameIncludes (obj, str) {
  return !!obj.name.includes(str);
}
/**
 * This file is part of the Telia Alt på et sted application.
 *
 * (c) APT AS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import toPX from 'to-px';

export const PI = Math.PI;
export const HALF_PI = PI * 0.5;
export const QUARTER_PI = PI * 0.25;
export const TAU = PI * 2;

export const blackMap =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

export const pow = (x, n) => {
  if (n === 0) return 1;
  if (n === -1) return 1 / x;
  if (n === 1) return x;

  return Math.exp(n * Math.log(Math.abs(x)));
};

export const rand = (max) => randBetween(0, max);
export const randBetween = (min, max) => Math.random() * (max - min) + min;

export const degToRad = (deg) => (deg * Math.PI) / 180;
export const radToDeg = (rad) => (rad * 180) / Math.PI;

export const easeIn = (power) => (t) =>
    power % 1 === 0 ? t ** power : pow(t, power);
export const easeOut = (power) => (t) =>
    power % 1 === 0
        ? 1 - Math.abs((t - 1) ** power)
        : 1 - Math.abs(pow(t - 1, power));
export const easeInOut = (power1, power2) => (t) =>
    t < 0.5
        ? easeIn(power1)(t * 2) / 2
        : easeOut(power2 || power1)(t * 2 - 1) / 2 + 0.5;

export const easeOutQuad = easeOut(2);
export const easeOutCubic = easeOut(3);
export const easeOutQuart = easeOut(4);
export const easeOutQuint = easeOut(5);
export const easeInQuad = easeIn(2);
export const easeInCubic = easeIn(3);
export const easeInQuart = easeIn(4);
export const easeInQuint = easeIn(5);
export const easeInOutQuad = easeInOut(2);
export const easeInOutCubic = easeInOut(3);
export const easeInOutQuart = easeInOut(4);
export const easeInOutQuint = easeInOut(5);

export const easeOutExpo = (t) => t * (-Math.pow(2, -10) + 1);

export const easeInBack = (t, magnitude = 1.70158) =>
    t * t * ((magnitude + 1) * t - magnitude);

export const easeOutBack = (t, magnitude = 1.70158) => {
  const scaledTime = t / 1 - 1;

  return (
      scaledTime * scaledTime * ((magnitude + 1) * scaledTime + magnitude) + 1
  );
};

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
export const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t;

export const getRandomPointOnSphere = (radius) => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);
  return [x, y, z];
};

export const getFractionBetween = (value, min, max) =>
    clamp((value - min) / (max - min), 0, 1);

export const remap = (val, low1, high1, low2, high2) =>
    low2 + ((high2 - low2) * (val - low1)) / (high1 - low1);

export const lerpHexColor = (a, b, amount) => {
  const ah = parseInt(a.replace(/#/g, ''), 16);
  const ar = ah >> 16;
  const ag = (ah >> 8) & 0xff;
  const ab = ah & 0xff;
  const bh = parseInt(b.replace(/#/g, ''), 16);
  const br = bh >> 16;
  const bg = (bh >> 8) & 0xff;
  const bb = bh & 0xff;
  const rr = ar + amount * (br - ar);
  const rg = ag + amount * (bg - ag);
  const rb = ab + amount * (bb - ab);

  return (
      '#' + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)
  );
};

export const hexToRGB = (hexString) => {
  const m = /^#?([A-Fa-f0-9]+)$/.exec(hexString);

  const hex = m[1];
  const size = hex.length;

  let r = 0;
  let g = 0;
  let b = 0;

  if (size === 3) {
    // #ff0
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255;
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255;
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255;
  } else if (size === 6) {
    // #ff0000
    r = parseInt(hex.charAt(0) + hex.charAt(1), 16) / 255;
    g = parseInt(hex.charAt(2) + hex.charAt(3), 16) / 255;
    b = parseInt(hex.charAt(4) + hex.charAt(5), 16) / 255;
  }

  return [r, g, b];
};
const global = globalThis

export const createWorker = (f) =>
    new global.Worker(global.URL.createObjectURL(new global.Blob([`(${f})()`])));

const { localStorage } = global;

export const storage = {
  read(key) {
    let fromStorage = null;

    try {
      fromStorage =
          localStorage.getItem(key) && JSON.parse(localStorage.getItem(key));
    } catch (err) {
      console.log(err);
    }

    return fromStorage;
  },

  write(key, data) {
    try {
      global.localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }

    return data;
  },

  destroy(key) {
    try {
      global.localStorage.removeItem(key);
    } catch (err) {
      console.log(err);
    }
  },
};

// get the visible viewport height at a certain depth in 3D space
export function visibleHeightAtZDepth(depth, camera) {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if (depth < cameraOffset) depth -= cameraOffset;
  else depth += cameraOffset;

  // vertical fov in radians
  const vFOV = (camera.fov * Math.PI) / 180;

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
}

export function visibleWidthAtZDepth(depth, camera) {
  const height = visibleHeightAtZDepth(depth, camera);
  return height * camera.aspect;
}

// convert from screen coords to normalized device coordinates (-1 -> +1)
export function screenToNDC(pos) {
  const x = (pos[0] / window.innerWidth) * 2 - 1;
  const y = -(pos[1] / window.innerHeight) * 2 + 1;
  return [x, y];
}

// check if touch device
export function isTouch() {
  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  const mq = function (query) {
    return window.matchMedia(query).matches;
  };

  if (
      'ontouchstart' in window ||
      (window.DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true;
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(
      ''
  );
  return mq(query);
}

export function mouseWheel(element, callback, noScroll) {
  if (typeof element === 'function') {
    noScroll = !!callback;
    callback = element;
    element = window;
  }
  let lineHeight = toPX('ex', element);
  let listener = function (ev) {
    ev.preventDefault();
    let dx = ev.deltaX || 0;
    let dy = ev.deltaY || 0;
    let dz = ev.deltaZ || 0;
    let mode = ev.deltaMode;
    let scale = 1;
    switch (mode) {
      case 1:
        scale = lineHeight;
        break;
      case 2:
        scale = window.innerHeight;
        break;
    }
    dx *= scale;
    dy *= scale;
    dz *= scale;
    if (dx || dy || dz) {
      return callback(dx, dy, dz, ev);
    }
  };
  element.addEventListener('wheel', listener, { passive: false });
  return listener;
}

export function inViewPort(camera, object) {
  const frustum = new THREE.Frustum();
  const cameraViewProjectionMatrix = new THREE.Matrix4();

  // every time the camera or objects change position (or every frame)
  camera.updateMatrixWorld(); // make sure the camera matrix is updated
  camera.matrixWorldInverse.getInverse(camera.matrixWorld);
  cameraViewProjectionMatrix.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
  );
  frustum.setFromMatrix(cameraViewProjectionMatrix);

  // frustum is now ready to check all the objects you need
  console.log(frustum.intersectsObject(object));
}

export function getScreenSize() {
  return window
      .getComputedStyle(document.body, ':after')
      .getPropertyValue('content')
      .replace(/["']/g, '');
}

export function debounce(func, wait, immediate) {
  let timeout;
  return () => {
    let context = this,
        args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export function range(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

