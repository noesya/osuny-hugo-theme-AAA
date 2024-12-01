var osuny = window.osuny || {},
    actionKeys = [
        'Enter',
        'Space'
    ],
    a11yClick,
    setButtonEnability,
    setAriaVisibility,
    ariaHideBodyChildren,
    setDefaultAltToImages;

a11yClick = function (element, action) {
    element.addEventListener('click', action);
    element.addEventListener('keydown', function (event) {
        if (actionKeys.includes(event.code)) {
            action(event);
        }
    });
};

setButtonEnability = function (button, enable) {
    button.disabled = !enable;
    button.ariaHidden = !enable;
};

setAriaVisibility = function (element, enable, isChild) {
    var focusableChildren = element.querySelectorAll('a, button, [role="button"]'),
        action = enable ? 'removeAttribute' : 'setAttribute';
    focusableChildren.forEach(function (child) {
        setAriaVisibility(child, enable, true);
    });
    if (isChild) {
        element[action]('tabindex', '-1');
    } else {
        element[action]('aria-hidden', 'true');
    }
};

ariaHideBodyChildren = function (element, inert) {
    var bodyChildren = document.body.children,
        action = inert ? 'setAttribute' : 'removeAttribute',
        ignoredElements = ['SCRIPT', 'STYLE'];

    Array.prototype.forEach.call(bodyChildren, function (child) {
        if (element !== child && !child.contains(element) && ignoredElements.indexOf(child.nodeName) === -1) {
            child[action]('aria-hidden', 'true');
        }
    }.bind(this));
};

setDefaultAltToImages = function (elements) {
    var index = 0,
        image;

    elements.forEach(function (element) {
        image = element.querySelector('img');
        if (!image.alt) {
            index += 1;
            image.alt = osuny.i18n.lightbox.default_alt + ' ' + index;
        }
    });
};

export {
    a11yClick,
    setButtonEnability,
    setAriaVisibility,
    ariaHideBodyChildren,
    setDefaultAltToImages
};
