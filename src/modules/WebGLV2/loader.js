import gsap from 'gsap';

class Loader {
    el = null
    setEl(el) {
        this.el = el;
        if(this.el)gsap.from(this.el, {
            opacity: 0,
            scale: 1.1,
            ease: 'power3.out',
            delay: 0.3,
        });
    }
    complete(done) {
        if(this.el)gsap.to(this.el, {
            opacity: 0,
            scale: 0.9,
            ease: 'power3.in',
            onComplete: () => {
                this.el.style.display = 'none';
                done();
            },
        });
        // this.tl.play();
    }
}

export default new Loader();
