// sections
import Frontpage from './modules/sections/frontpage';
// import Plant from './webgl/sections/plant';
// import Products from './webgl/sections/products';
// import Chemistry from './webgl/sections/chemistry';
// import Health from './webgl/sections/health';
// import Smuggling from './webgl/sections/smuggling';
// import SmugglingGame from './webgl/sections/smuggling-game';
// import Sale from './webgl/sections/sale';
// import Statistics from './webgl/sections/statistics';
// import Prohibited from './webgl/sections/prohibited';
// import Links from './webgl/sections/links';

export default [
    {
        Constructor: Frontpage,
        name: 'Frontpage',
        el: ['#introText'],
        theme: 'light',
        fog: { near: 15, far: 36 },
    }
];
