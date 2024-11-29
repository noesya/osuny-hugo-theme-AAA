/* eslint-disable no-underscore-dangle */
/* eslint-disable new-cap */

import { parentQuerySelector } from '../utils/a11y';

// Leaflet
var L = window.L || {},
    osuny = window.osuny || {};

osuny.Map = function (element) {
    this.element = element;
    this.markers = [];
    this.popups = [];
    this.options = {
        popup: { maxWidth: 1000 }
    };
    this.init();
};

osuny.Map.prototype.init = function () {
    this.setMap();
    this.setMarkers();
    this.fitToMapBounds();
    this.setAccessibility();
};

osuny.Map.prototype.setMap = function () {
    this.mapElement = this.element.querySelector('.map');
    this.map = L.map(this.element, {
        scrollWheelZoom: false
    });

    this.layers = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    this.layers.addTo(this.map);
};

osuny.Map.prototype.setMarkers = function () {
    this.setMarkerIcon();
    this.elements = Array.prototype.slice.call(this.element.children);
    this.elements.forEach(this.createMarker.bind(this));

    if (this.popups.length === 1) {
        this.map.openPopup(this.popups[0]);
    }
};

osuny.Map.prototype.setMarkerIcon = function () {
    var url = this.element.getAttribute('data-marker-icon') || '/assets/images/map-marker.svg';
    this.markerIcon = L.icon({
        iconUrl: url,
        iconSize: [17, 26]
    });
};

osuny.Map.prototype.createMarker = function (element, opened) {
    var latitude = parseFloat(element.getAttribute('data-latitude')),
        longitude = parseFloat(element.getAttribute('data-longitude')),
        coordinates = [latitude, longitude];
    if (Boolean(coordinates[0]) && Boolean(coordinates[1])) {
        this.addMarker(coordinates, element, opened);
    }
};

osuny.Map.prototype.addMarker = function (location, element) {
    var marker = new L.marker(location, {
            icon: this.markerIcon,
            title: element.getAttribute('data-title'),
            alt: ''
        }),
        popup = new L.Popup(location, this.options.popup);

    element.id = marker.id;
    popup.setContent(element);

    this.map.addLayer(marker);
    marker.bindPopup(popup);

    this.popups.push(popup);
    this.markers.push(marker);
    this.setMarkerAccessibility(marker);
};

osuny.Map.prototype.setMarkerAccessibility = function (marker) {
    var icon = marker._icon;

    if (!icon) {
        return;
    }

    icon.setAttribute('aria-label', 'Afficher les informations de ' + marker.title);
    icon.setAttribute('aria-controls', marker.id);
    icon.setAttribute('aria-expanded', 'false');

    marker.addEventListener('popupopen', function () {
        icon.setAttribute('aria-expanded', 'true');
    });

    marker.addEventListener('popupclose', function () {
        icon.setAttribute('aria-expanded', 'false');
    });
};

osuny.Map.prototype.fitToMapBounds = function () {
    var group = L.featureGroup(this.markers).addTo(this.map);
    this.map.fitBounds(group.getBounds());
};

osuny.Map.prototype.setAccessibility = function () {
    var title = parentQuerySelector(this.element, '.block', '.block-title'),
        p;

    // Buttons
    if (!title) {
        return;
    }
    this.setZoomAria('_zoomInButton', title.id, 'zoom_in');
    this.setZoomAria('_zoomOutButton', title.id, 'zoom_out');

    // Attributions
    p = document.createElement('p');
    p.innerHTML = this.map.attributionControl._container.innerHTML;
    p.querySelector('a[title]').setAttribute('title', osuny.i18n.maps.attribution_title);

    this.map.attributionControl._container.innerHTML = '';
    this.map.attributionControl._container.append(p);

    setTimeout(this.setPopupAccessibility.bind(this), 10);
};

osuny.Map.prototype.setPopupAccessibility = function () {
    var button = this.element.querySelector('.leaflet-popup-close-button');
    // TODO = traduire le bouton
};

osuny.Map.prototype.setZoomAria = function (buttonKey, id, i18nKey) {
    var button = this.map.zoomControl[buttonKey];
    button.setAttribute('aria-describedby', id);
    button.setAttribute('aria-label', osuny.i18n.maps[i18nKey]);
};

// Selectors
(function () {
    var maps = document.querySelectorAll('[data-map]');
    maps.forEach(function (map) {
        new osuny.Map(map);
    });
}());
