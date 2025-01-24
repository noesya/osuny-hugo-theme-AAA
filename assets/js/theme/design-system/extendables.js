import { a11yClick } from '../utils/a11y';

var osuny = window.osuny || {};

osuny.Extendable = function (element) {
    this.element = element;
    this.buttons = document.querySelectorAll('[aria-controls=' + this.element.id + ']');
    this.state = {
        opened: false,
        // Button who opened the extendable
        openedByButton: null
    };
    this.options = {
        // This attribute determine if extendable should close others when opened
        closeSiblings: this.element.getAttribute('data-extendable-close-siblings'),
        autoClose: this.element.getAttribute('data-extendable-auto-close')
    };

    this.listen();
};

osuny.Extendable.prototype.listen = function () {
    if (this.options.autoClose) {
        this.handleAutoClose();
    }

    this.buttons.forEach(function (button) {
        a11yClick(button, function (event) {
            event.preventDefault();
            this.toggle();
            this.a11yFocus(button);
        }.bind(this));
    }.bind(this));

    this.element.addEventListener('extendable-close', this.toggle.bind(this, true));
};

osuny.Extendable.prototype.handleAutoClose = function () {
    window.addEventListener('click', function (event) {
        if (this.state.opened && event.target !== this.state.openedByButton) {
            this.toggle(true);
        }
    }.bind(this));
};

osuny.Extendable.prototype.a11yFocus = function (button) {
    if (this.state.opened) {
        this.state.openedByButton = button;
    } else if (this.state.openedByButton) {
        this.state.openedByButton.focus();
    }
};

osuny.Extendable.prototype.toggle = function (forceClose) {
    this.state.opened = forceClose ? false : !this.state.opened;

    if (this.state.opened && this.options.closeSiblings) {
        this.closeSiblings();
    }

    this.buttons.forEach(function (button) {
        if (button.getAttribute('aria-expanded')) {
            button.setAttribute('aria-expanded', this.state.opened);
        }
    }.bind(this));
};

osuny.Extendable.prototype.closeSiblings = function () {
    var extendables = this.element.parentNode.querySelectorAll('.extendable');
    extendables.forEach(function (extendable) {
        if (this.element !== extendable) {
            extendable.dispatchEvent(new Event('extendable-close'));
        }
    }.bind(this));
};

(function () {
    osuny.utils.instanciateAll('.extendable, .collapse', osuny.Extendable);
}());
