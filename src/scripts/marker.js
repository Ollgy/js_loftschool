import { showPopup } from './popup.js';

const createMarker = (map, obj, clusterer, popup) => {
    const marker = new ymaps.Placemark(
        obj.coords, 
        {  
            balloonContentPlace: obj.reviews[0].place,
            balloonContentAddress: obj.address,
            balloonContentReview: obj.reviews[0].content,
            balloonContentFooter: obj.reviews[0].time,
        }, 
        {
            preset: 'islands#violetIcon',
            openBalloonOnClick: false
        });

    marker.events.add('click', () => {
        const coords = marker.geometry.getCoordinates();

        popup.setAttribute('data-coordx', coords[0]);
        popup.setAttribute('data-coordy', coords[1]);

        showPopup(popup, obj.pos, { coords: obj.coords, reviews: obj.reviews });
    });

    map.geoObjects.add(marker);
    clusterer.add(marker);
}

const placeMarkerFromStorage = (list, map, clusterer, popup) => {
    list.forEach(elem => createMarker(map, elem, clusterer, popup));
}

export { createMarker, placeMarkerFromStorage };
