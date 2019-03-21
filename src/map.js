import ReviewObj from './scripts/reviewObj.js';
import { formattedTime, clearFields } from './scripts/utils.js';
import { showPopup, showPopupAddressQuery, addReview } from './scripts/popup.js';
import { createMarker, placeMarkerFromStorage } from './scripts/marker.js';

const mapContainer = document.querySelector('#map-container');
const popup = document.querySelector('#popup');
const form = popup.querySelector('#form');
const list = popup.querySelector('#list');
const reviewObjList = localStorage.reviewObjList ? JSON.parse(localStorage.reviewObjList) : [];

let myMap, clusterer;

function init() {
    myMap = new ymaps.Map('map-container', {
        center: [59.95150156417459, 30.488551499999996],
        zoom: 15
    });
   
    myMap.events.add('click', function (e) {
        const domClick = e.get('domEvent').originalEvent;
        const pos = { x: domClick.pageX, y: domClick.pageY };
        const data = { coords: e.get('coords'), reviews: [] };

        popup.setAttribute('data-coordx', data.coords[0]);
        popup.setAttribute('data-coordy', data.coords[1]);

        showPopup(popup, pos, data);
    });

    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div class=ballon_place>{{ properties.balloonContentPlace|raw }}</div>' +
        '<a href="" onclick="event.preventDefault();" id="ballon_address"' +
        'class=ballon_address>{{ properties.balloonContentAddress|raw }}</a>' +
        '<div class=ballon_review>{{ properties.balloonContentReview|raw }}</div>' +
        '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
    );

    clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        preset: 'islands#invertedVioletClusterIcons',
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: customItemContentLayout,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        clusterHideIconOnBalloonOpen: false,
        clusterBalloonPagerSize: 4
    });

    myMap.geoObjects.add(clusterer);

    placeMarkerFromStorage(reviewObjList, myMap, clusterer, popup);
}

ymaps.ready(init);

mapContainer.addEventListener('click', (e) => {
    if (e.target.id === 'ballon_address') {
        showPopupAddressQuery(e, popup, reviewObjList);
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    e.target.forEach = [].forEach;
    e.target.filter = [].filter;

    const data = {
        name: '',
        place: '',
        time: '',
        content: ''
    };
    const coords = [+popup.dataset.coordx, +popup.dataset.coordy];
    const address = popup.querySelector('.header__place').innerText;
    
    data.time = formattedTime(new Date());
    
    e.target
        .filter(elem => elem.id !== 'button')
        .forEach(elem => data[elem.id] = elem.value);
    
    const reviewObj = reviewObjList.find(elem => elem.reviews[0].place === data.place && elem.address === address);
    const pos = { x: popup.getBoundingClientRect().left, y: popup.getBoundingClientRect().top };

    if (!reviewObj) {
        const reviewObj = new ReviewObj(popup, coords, pos, [data]);

        createMarker(myMap, reviewObj, clusterer, popup);
        reviewObjList.push(reviewObj);
    } else {
        reviewObj.reviews.push(data);
    }

    localStorage.reviewObjList = JSON.stringify(reviewObjList);

    addReview(data, list);
    clearFields(e.target);
});