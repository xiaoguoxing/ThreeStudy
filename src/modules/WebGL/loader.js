import gsap from 'gsap';

class Loader {

    init(el) {
        this.el = el;
        gsap.from(this.el, {
            opacity: 0,
            scale: 1.1,
            ease: 'power3.out',
            delay: 0.3,
        });
        // this.setupAnimations();
    }

    setupAnimations() {
        this.tl = gsap.timeline({
            paused: true,
            delay: 2.5,
            defaults: { ease: 'power2.out' },
        });

        this.tl.from('#introText h1', { opacity: 0, y: 30 });
        this.tl.from('#introText p', { opacity: 0, y: 30 }, 0.15);
        this.tl.from('#introText button', { opacity: 0, y: 30 }, 0.3);
        this.tl.from('nav.content-menu', { opacity: 0, x: 30 }, 0.45);
    }

    complete(done) {
        gsap.to(this.el, {
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
