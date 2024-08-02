window.osuny = window.osuny || {};

// Méhodes ajoutées comme des traits (décorateur) aux objets qui en ont besoin
window.osuny.utils.carousel = {
    findElement: function(classKey) {
        var className = window.osuny.carousel.classes[classKey];
        return this.element.getElementsByClassName(className).item(0);
    },
    dispatchEvent: function (eventKey) {
        var eventName = window.osuny.carousel.events[eventKey];
        var event = new Event(eventName);
        this.element.dispatchEvent(event);
    }
}