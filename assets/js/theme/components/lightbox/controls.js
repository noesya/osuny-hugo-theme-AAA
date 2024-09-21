/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.lightbox = window.osuny.lightbox || {};

window.osuny.lightbox.ControlRack = function (element) {
    this.element = element;
    this._findElement = window.osuny.lightbox.utils.findElement.bind(this);
    this.buttons = {
        close: this._findElement('closeButton'),
        previous: this._findElement('prevButton'),
        next: this._findElement('nextButton'),
        description: this._findElement('infoButton'),
        credit: this._findElement('creditButton')
    };
    this._initializeEvents();
};

window.osuny.lightbox.ControlRack.prototype = {
    _initializeEvents () {
        var i = 0,
            key = 0,
            action = null;
        for (i=0; i< Object.keys(this.buttons).length; i+=1) {
            key = Object.keys(this.buttons)[i];
            action = this._dispachEvent.bind(this, key);
            this.buttons[key].addEventListener('click', action);
        }
    },
    _showArrows () {
        this._showButton(this.buttons.previous);
        this._showButton(this.buttons.next);
    },
    _hideArrows () {
        this._hideButton(this.buttons.previous);
        this._hideButton(this.buttons.next);
    },
    _dispachEvent (eventname) {
        var event = new Event(eventname);
        this.element.dispatchEvent(event);
    },
    _showButton (button) {
        button.style.display = 'block';
    },
    _hideButton (button) {
        button.style.display = 'none';
    },
    load (lightbox) {
        if (lightbox.isGallery) {
            this._showArrows();
        } else {
            this._hideArrows();
        }
        this.buttons.next.disabled = lightbox.next === null;
        this.buttons.previous.disabled = lightbox.previous === null;

        if (lightbox.credit) {
            this._showButton(this.buttons.credit);
        } else {
            this._hideButton(this.buttons.credit);
        }

        if (lightbox.description) {
            this._showButton(this.buttons.description);
        } else {
            this._hideButton(this.buttons.description);
        }
    },
    showDescription () {
        this.buttons.description.classList.add('active');
        this.buttons.credit.classList.remove('active');
    },
    showCredit () {
        this.buttons.credit.classList.add('active');
        this.buttons.description.classList.remove('active');
    },
    reset () {
        this.buttons.description.classList.remove('active');
        this.buttons.credit.classList.remove('active');
    }
};
