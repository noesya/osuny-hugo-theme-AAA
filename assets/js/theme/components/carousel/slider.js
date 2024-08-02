window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Slider = function Slider(element) {
    this.element = element;
    this._findElement = window.osuny.utils.carousel.findElement.bind(this),
    this.container = this._findElement("container");
    this.transitionDuration = 0;
    this.index = 0;
    this.slides = [];
    this.deltaPosition = 0;
    this.drag = null;
    var slidesContainers = this.container.children;
    for (var i = 0; i < slidesContainers.length; i += 1) {
        var slideContainer = slidesContainers.item(i);
        this.slides.push(new window.osuny.carousel.Slide(this, slideContainer, i));
    }
    this.showSlide(this.index);
}
window.osuny.carousel.Slider.prototype = {
    showSlide: function (index) {
        this.index = index;
        var behavior = (this.transitionDuration > 0) ? "smooth" : "instant";
        this.element.scrollTo({
            top: 0,
            left: this._slidePosition(index),
            behavior: behavior
        });
        this._updateSlidesClasses();
    },
    recompute: function(){
        this.slides.forEach(function(slide) {
            slide.computeWidth();
        });
        this.showSlide(this.index);
    },
    length: function () {
        return this.slides.length;
    },
    currentSlideIndex: function () {
        var currentWidth = 0;
        // Le seuil permet d'éviter des erreurs d'arrondis qui causent un retour en slide 1, par étapes
        var threshold = 20;
        for (var index = 0; index < this.slides.length; index += 1) {
            var slide = this.slides[index];
            currentWidth += slide.width;
            if (currentWidth > this.element.scrollLeft + threshold) {
                return index;
            }
        }
        return 0;
    },
    _slidePosition: function (index) {
        var position = 0;
        for (var i = 0; i < index; i += 1) {
            position += this.slides[i].width;
        }
        return position;
    },
    _updateSlidesClasses: function () {
        this.slides.forEach(function(slide) {
            slide.setClasses();
        });
    }
}