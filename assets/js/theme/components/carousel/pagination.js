window.osuny = window.osuny || {};
window.osuny.carousel = window.osuny.carousel || {};

window.osuny.carousel.Pagination = function (instance) {
    this.instance = instance;
    this.slider = this.instance.slider;
    this.container = null;
    this.tabButtons = [];
    this.toggleButton = null;
    this.tabButtonModel = null;
    this.carouselLength = this.slider.length();
    this.initialize();
}

window.osuny.carousel.Pagination.prototype = {
    classes: {
        container: "carousel__pagination",
        pagination: "carousel__pagination__tabcontainer"
    },

    initialize: function () {
        this.container = this.instance.root.getElementsByClassName(this.classes.container).item(0);
        if (this.instance.options.pagination) {
            this.initializeTabPagination();
        }

        if (this.instance.options.autoplay) {
            this.toggleButton = new window.osuny.carousel.ToggleButton(this);
        }
    },

    initializeTabPagination() {
        var pagination = this.container.getElementsByClassName(this.classes.pagination).item(0);
        if(this.instance.options.autoplay){
            pagination.classList.add('has_toggle');
        }
        this.tabButtonModel = pagination.querySelector('li').cloneNode(true);
        pagination.removeChild(pagination.querySelector('li'));
        
        this.tabButtons = [];
        for (var i = 0; i < this.carouselLength; i += 1) {
            this.tabButtons.push(new window.osuny.carousel.PaginationButton(i, this))
            pagination.append(this.tabButtons[i].container);
        }
        this.container.classList.add('is-visible');
    },

    setSlideProgression: function (progression) {
        this.tabButtons[this.slider.index].setProgress(progression);
    },
    resetSlidesProgression: function () {
        this.tabButtons.forEach(function (tabButton) {
            tabButton.setProgress(0);
        });
    },
    onSlideChanged: function(){
        this.resetSlidesProgression()
        this.setSlideProgression(1);
    }
}

window.osuny.carousel.PaginationButton = function PaginationButton(index, pagination) {
    this.index = index;
    this.progress = 0;
    this.container = null;
    this.progressBar = null;
    this.pagination = pagination;
    this.instance = this.pagination.instance
    this.initialize();
}

window.osuny.carousel.PaginationButton.prototype = {
    initialize: function () {
        this.container = this.pagination.tabButtonModel.cloneNode(true);
        var button = this.container.querySelector('button');
        button.setAttribute("aria-controls", "slideX".replace("X", this.index));
        button.setAttribute("tabindex", this.index);

        this.progressBar = button.querySelector("i");

        this.setProgress(0);
        this.initializeListener();
    },
    initializeListener: function () {
        var callBack = this.onClick.bind(this);
        this.container.addEventListener("click", function (e) {
            callBack(e);
        });
    },
    onClick: function (e) {
        this.pagination.slider.showSlide(this.index);
        if(this.instance.options.autoplay){
            this.instance.autoplayer.stop();
            this.pagination.toggleButton.toggleStop();
        }
        this.setProgress(1)
    },
    setProgress: function (progress) {
        this.progress = progress;
        this.progressBar.style.setProperty("width", String(this.progress * 100) + "%");
    }
}

window.osuny.carousel.ToggleButton = function (pagination) {
    this.class = [];
    this.state = 0;
    this.pagination = pagination;
    this.instance = this.pagination.instance;
    this.container = null;
    this.initialize();
}
window.osuny.carousel.ToggleButton.prototype = {
    classes: {
        button: "toggle",
        pause: "toggle__pause",
        play: "toggle__play"
    },
    initialize: function () {
        this.state_classes = [this.classes.play, this.classes.pause];
        this.container = this.pagination.container.getElementsByClassName(this.classes.button).item(0);
        this.container.classList.add('is-visible');
        this.container.classList.add(this.state_classes[this.state]);
        this.initializeListener();
    },
    toggleUI: function () {
        var newState = Math.abs(this.state - 1);
        this.container.classList.replace(this.state_classes[this.state], this.state_classes[newState]);
        this.state = newState;
    },
    toggleStart: function () {
        if (this.state == 0) {
            this.toggleUI();
        }
    },
    toggleStop: function () {
        if (this.state == 1) {
            this.toggleUI();
        }
    },
    initializeListener: function () {
        var callBack = this.onClick.bind(this);
        this.container.addEventListener("click", function (e) {
            callBack(e);
        });
    },
    onClick: function (e) {
        this.toggleUI();
        if (this.state == 0) {
            this.instance.autoplayer.stop();
        } else {
            this.instance.autoplayer.start();
        }
    }
}