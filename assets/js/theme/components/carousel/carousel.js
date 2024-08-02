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
    this._findElement = window.osuny.utils.carousel.findElement.bind(this),
    this._initializeConfig();
    this._initializeSlider();
    this._initializePagination();
    this._initializeArrows();
    this._initializeAutoplayer();
    this._initializeMouseEvents();
    this.showSlide(0);
    this.state.initialized = true;
}
window.osuny.carousel.Carousel.prototype = {
    next: function () {
        var index = this.slides.current + 1;
        if (index >= this.slides.total) {
            index = 0;
        }
        this.showSlide(index);
    },
    previous: function () {
        var index = this.slides.current - 1;
        if (index < 0) {
            // -1 parce que 0-indexed 
            index = this.slides.total - 1;
        }
        this.showSlide(index);
    },
    showSlide: function (index) {
        this.slides.current = index;
        this.pagination.unselectAllButtons();
        this.pagination.selectButton(index);
        this.slider.showSlide(index);
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
            this.slider.recompute();
        }.bind(this), 200);
    },
    setCarouselState: function(state){
        this.sliderContainer.setAttribute("aria-live", state);
    },
    isInViewPort: function(){
        var boundingRect = this.element.getBoundingClientRect(),
            screenHeight = window.innerHeight || document.documentElement.clientHeight,
            elementBottomInViewport = boundingRect.bottom >= 0,
            elementTopInViewport = boundingRect.top <= screenHeight;
        return elementBottomInViewport || elementTopInViewport;
    },
    getCenterPositionY: function () {
        var boundingRect = this.element.getBoundingClientRect();
        return boundingRect.top + boundingRect.height / 2;
    },
    _initializeConfig: function () {
        this.config = new window.osuny.carousel.Config(this);
        // Les options sont chargées depuis le data-attribute "data-carousel"
        this.config.loadOptions(this.element.dataset.carousel);
    },
    _initializePagination: function () {
        var paginationElement = this._findElement("pagination");
        this.pagination = new window.osuny.carousel.Pagination(paginationElement);
        if (paginationElement) {
            paginationElement.addEventListener(
                window.osuny.carousel.events.paginationButtonClicked,
                this._onPaginationButtonClicked.bind(this)
            );
        }
    },
    _initializeArrows: function  () {
        var arrowsElement = this._findElement("arrows");
        this.arrows = new window.osuny.carousel.Arrows(arrowsElement);
        if (arrowsElement) {
            arrowsElement.addEventListener(
                window.osuny.carousel.events.arrowsNext,
                this.next.bind(this)
            );
            arrowsElement.addEventListener(
                window.osuny.carousel.events.arrowsPrevious,
                this.previous.bind(this)
            );
        }
    },
    _initializeSlider: function () {
        var sliderElement = this._findElement("slider");
        this.slider = new window.osuny.carousel.Slider(sliderElement);
        this.slider.transitionDuration = this.config.transitionDuration
        this.slides.total = this.slider.length();
        sliderElement.addEventListener(
            "scrollend",
            this._onSliderScrollend.bind(this)
        );
    },
    _initializeAutoplayer(){
        this.autoplayerElement = this._findElement("autoplayerToggle");
        this.autoplayer = new window.osuny.carousel.Autoplayer(this.autoplayerElement);
        this.autoplayer.setInterval(this.config.autoplayInterval);
        if (this.autoplayerElement) {
            this.autoplayerElement.addEventListener(
                window.osuny.carousel.events.autoplayerTrigger,
                this.next.bind(this)
            );
            this.autoplayerElement.addEventListener(
                window.osuny.carousel.events.autoplayerProgression,
                this._onAutoplayerProgression.bind(this)
            );
            if (this.config.autoplay) {
                this.autoplayer.enable();
            }
        }
    },
    _initializeMouseEvents: function(){
        this.element.addEventListener(
            "mouseenter",
            this.autoplayer.softPause.bind(this.autoplayer)
        );
        this.element.addEventListener(
            "mouseleave",
            this.autoplayer.softUnpause.bind(this.autoplayer)
        );
    },
    _onAutoplayerProgression: function (event) {
        this.pagination.setProgression(event.value);
    },
    _onPaginationButtonClicked: function (event) {
        this.autoplayer.disable();
        this.showSlide(event.index);
    },
    _onSliderScrollend: function () {
        var index = this.slider.currentSlideIndex();
        if (this.slides.current != index) {
            this.showSlide(index);
        }
    }
}