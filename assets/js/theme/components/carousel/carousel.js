window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Carousel = function (element) {
    this.element = element;
    this.slides = {
        current: 0,
        total: 0
    }
    this.state = {
        initialized: false,
        visible: false
    };
    this.windowResizeTimeout;

    this._initializeConfig();
    this._initializeSlider();
    this._initializePagination();
    this._initializeArrows();
    this._initializeAutoplayer();
    this.showSlide(0);
    this.state.initialized = true;
}
window.osuny.carousel.Carousel.prototype = {
    next: function () {
        this.slides.current += 1;
        if (this.slides.current >= this.slides.total) {
            this.slides.current = 0;
        }
        this.showSlide(this.slides.current);
    },
    previous: function () {
        this.slides.current -= 1;
        if (this.slides.current < 0) {
            // -1 parce que 0-indexed 
            this.slides.current = this.slides.total - 1;
        }
        this.showSlide(this.slides.current);
    },
    showSlide: function (index) {
        this.pagination.unselectAllButtons();
        this.pagination.selectButton(index);
        this.slider.showSlide(index);
        this.slides.current = index;
        this.arrows.update(this.slides.current, this.slides.total);
    },
    pause: function () {
        this.autoplayer.pause();
    },
    unpause: function () {
        this.autoplayer.unpause();
    },
    resize: function () {
        clearTimeout(this.windowResizeTimeout);
        this.windowResizeTimeout = setTimeout(function () {
            this.slider.reCompute();
        }.bind(this), 200);
    },
    setCarouselState: function(state){
        this.sliderContainer.setAttribute("aria-live", state);
    },
    _initializeConfig: function () {
        this.config = new window.osuny.carousel.Config(this);
        // Les options sont chargées depuis le data-attribute "data-carousel"
        this.config.loadOptions(this.element.dataset.carousel);
    },
    _initializePagination: function () {
        var paginationElement = this.element.getElementsByClassName(window.osuny.carousel.classes.pagination).item(0);
        this.pagination = new window.osuny.carousel.Pagination(paginationElement);
        if (paginationElement) {
            paginationElement.addEventListener(window.osuny.carousel.events.paginationButtonClicked, this._onPaginationButtonClicked.bind(this));
        }
    },
    _initializeArrows: function  () {
        var arrowsElement = this.element.getElementsByClassName(window.osuny.carousel.classes.arrows).item(0);
        this.arrows = new window.osuny.carousel.Arrows(arrowsElement);
        if (arrowsElement) {
            arrowsElement.addEventListener(window.osuny.carousel.events.arrowsNext, this.next.bind(this));
            arrowsElement.addEventListener(window.osuny.carousel.events.arrowsPrevious, this.previous.bind(this));
        }
    },
    _initializeSlider: function () {
        var sliderContainer = this.element.getElementsByClassName(window.osuny.carousel.classes.container).item(0);
        this.slider = new window.osuny.carousel.Slider(sliderContainer);
        this.slider.transitionDuration = this.config.transitionDuration
        this.slides.total = this.slider.length();
    },
    _initializeAutoplayer(){
        this.autoplayerElement = this.element.getElementsByClassName(window.osuny.carousel.classes.toggle).item(0);
        this.autoplayer = new window.osuny.carousel.Autoplayer(this.autoplayerElement);
        this.autoplayer.setInterval(this.config.autoplayInterval);
        if (this.autoplayerElement) {
            this.autoplayerElement.addEventListener(window.osuny.carousel.events.autoplayerTrigger, this._onAutoplayerTrigger.bind(this));
            this.autoplayerElement.addEventListener(window.osuny.carousel.events.autoplayerProgression, this._onAutoplayerProgression.bind(this));
            this.autoplayerElement.addEventListener(window.osuny.carousel.events.autoplayerPause, this._onAutoplayerPause.bind(this));
            this.autoplayerElement.addEventListener(window.osuny.carousel.events.autoplayerPlay, this._onAutoplayerPlay.bind(this));
            if (this.config.autoplay) {
                this.autoplayer.enable();
            }
        }
    },
    _onAutoplayerTrigger: function () {
        this.next();
    },
    _onAutoplayerProgression: function (event) {
        this.pagination.setProgression(event.progression);
    },
    // TODO S'il n'y a rien à faire à l'extérieur de l'autoplayer, il faudra arrêter d'écouter ça et le laisser ce débrouiller seul
    _onAutoplayerPause: function () {
        this.autoplayer.pause();
    },
    // TODO Idem
    _onAutoplayerPlay: function () {
        this.autoplayer.unpause();
        this.autoplayer.enable();
    },
    _onPaginationButtonClicked: function (event) {
        this.autoplayer.disable();
        this.showSlide(event.index);
    },
    inViewPort: function(){
        var boundingRect = this.element.getBoundingClientRect();
        return (
            boundingRect.bottom >= 0 &&
            boundingRect.top <= (window.innerHeight || document.documentElement.clientHeight)
        );
    },
    getCenterPositionY: function () {
        var boundingRect = this.element.getBoundingClientRect();
        return boundingRect.top + boundingRect.height / 2;
    }

    
    // // Autoplayer events
    // stopAutoplay: function () {
    //     if (this.autoplayer) {
    //         this.autoplayer.stop();
    //         this.autoplayerControl.toggleStart();
    //         this.setCarouselState("polite");
    //     }
    // },
    // startAutoplay: function () {
    //     this.autoplayer.start();
    //     this.toggleButton.play();
    //     // this.autoplayerControl.toggleStop();
    //     this.setCarouselState("off");
    // },
    // pauseAutoplay: function () {
    //     if (this.autoplayer) {
    //         this.autoplayer.pause();
    //     }
    // },
    // unpauseAutoplay: function () {
    //     if (this.autoplayer) {
    //         this.autoplayer.unpause();
    //     }
    // },
    // onAutoplayProgressionChanged: function (e) { 
    //     // console.log(e)
    //     if (this.pagination) {
    //         this.pagination.setSlideProgression(e.progression);
    //     }
    // },
    // Slider control
    // resetSlider: function () {
    //     this.slider.initialize();
    // },
    // onSlideChanged: function () {
    //     if (this.slider) {
    //         this.slides.current = this.slider.index;
    //     }
    //     if (this.autoplayer) {
    //         this.autoplayer.disable();
    //         this.toggleButton.pause();
    //     }
    //     if (this.pagination) {
    //         this.pagination.onSlideChanged();
    //     }
    //     if (this.arrows) {
    //         this.arrows.onSlideChanged();
    //     }
    // },

    // // Drag control
    // endDrag: function () {
    //     if (this.slider.drag) {
    //         this.slider.drag.end();
    //     }
    // },
    // startDrag: function (position) {
    //     if (this.slider.drag) {
    //         this.slider.drag.start(position);
    //     }
    // },
    // drag: function (position) {
    //     if (this.slider.drag.active) {
    //         this.slider.drag.drag(position);
    //     }
    // }
}