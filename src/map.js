const mapContainer = document.querySelector('#map-container');
const popup = document.querySelector('#popup');
const form = popup.querySelector('#form');
const list = popup.querySelector('#list');
const reviewObjList = [];
let clusterer;

function init() {
    myMap = new ymaps.Map("map-container", {
        center: [59.95150156417459,30.488551499999996],
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
        '<a href="" onclick="event.preventDefault();" class=ballon_address>{{ properties.balloonContentAddress|raw }}</a>' +
        '<div class=ballon_review>{{ properties.balloonContentReview|raw }}</div>' +
        '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
    );

    clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        preset: 'islands#invertedVioletClusterIcons',
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: customItemContentLayout,
        // Устанавливаем режим открытия балуна. 
        // В данном примере балун никогда не будет открываться в режиме панели.
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        clusterHideIconOnBalloonOpen: false,
        clusterBalloonPagerSize: 4
    });
    myMap.geoObjects.add(clusterer);
 };

ymaps.ready(init);

// constructor storage for reviews data
function ReviewObj(coords, pos, data) {
    this.coords = coords;
    this.address = popup.querySelector('.header__place').innerText;
    this.pos = pos;
    this.reviews = data;
    this.marker = null;

    const now = new Date();

    this.createMarker = (coords) => {
        this.marker = new ymaps.Placemark(
            coords, 
            {  
                balloonContentPlace: this.reviews[0].place,
                balloonContentAddress: this.address,
                balloonContentReview: this.reviews[0].content,
                balloonContentFooter: `${now.getFullYear()}.${now.getMonth()}.${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
            }, 
            {
                preset: 'islands#violetIcon',
            });

        this.marker.events.add('click', () => {
            showPopup(popup, pos, { coords: this.coords, reviews: this.reviews })
        });

        myMap.geoObjects.add(this.marker);
        clusterer.add(this.marker);
    }

}

// work with placement of marker and review list
form.addEventListener('submit', (e) => {
    e.preventDefault();

    e.target.forEach = [].forEach;
    e.target.filter = [].filter;

    const data = {};
    const coords = [+popup.dataset.coordx, +popup.dataset.coordy];
    const address = popup.querySelector('.header__place').innerText;

    e.target
        .filter(elem => elem.id !== 'button')
        .forEach(elem => data[elem.id] = elem.value);
    
    const reviewObj = reviewObjList.find(elem => elem.reviews[0].place === data.place && elem.address === address);
    const pos = {x: popup.getBoundingClientRect().left, y: popup.getBoundingClientRect().top};

    if (!reviewObj) {
        const reviewObj = new ReviewObj(coords, pos, [data]);

        reviewObj.createMarker(coords);
        reviewObjList.push(reviewObj);
        console.log(reviewObjList);

    } else {
        reviewObj.reviews.push(data);
    }

    addReview(data, list);

});

const addReview = (data, parent) => {
    if(parent.firstChild && parent.firstChild.nodeType === 3) parent.firstChild.remove();

    const item = document.createElement('div');
    item.classList.add('review__item');

    for (let key in data) {
        const elem = document.createElement('div');
        elem.classList.add(`review__${key}`);
        elem.innerText = data[key];
        item.appendChild(elem);
    }

    parent.appendChild(item);
}



// work with geocoder
const getGeocoderInfo = (coords) => {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', `https://geocode-maps.yandex.ru/1.x/?apikey=ccd8c01e-3de3-453d-898e-ff4d72c9efd1&geocode=${coords[1]},${coords[0]}`, true);
        xhr.send();

        xhr.onload = () => {
            if (xhr.status != 200) {
                throw new Error('!!!');
            } else {
                const response = xhr.responseXML;

                resolve(response);
            }
        }
    });
}

const setAddress = (coords, block) => {
    return getGeocoderInfo(coords).then(result => 
       block.innerText = result.querySelector('formatted').textContent + ''
    );
} 

const showPopup = (popup, pos, data) => {
    if (popup.classList.contains('hidden')) {
        popup.classList.add('hidden')
    }

    if (data.reviews.length) {
        const fr = document.createDocumentFragment();

        data.reviews.forEach(review => addReview(review, fr));
        list.appendChild(fr);
    } else {
        list.innerText = 'Отзывов пока нет...'
    }

    setAddress(data.coords, popup.querySelector('.header__place')).then(() => {
        popup.style.top = pos.y + styleInNum(popup, 'height') > window.innerHeight ? `${window.innerHeight - styleInNum(popup, 'height')}px` : `${pos.y}px`;
        popup.style.left = pos.x + styleInNum(popup, 'width') > window.innerWidth ? `${window.innerWidth - styleInNum(popup, 'width')}px` : `${pos.x}px`;
        popup.classList.remove('hidden');
    });
}

const showPopupAddressQuery = (e) => {
    e.preventDefault();

    const address = e.target.innerText;
    const reviews = reviewObjList.filter(obj => obj.address === address).map(obj => obj.review())
    const coords = reviewObjList.filter(obj => obj.address === address)[0].coords;
        
    showPopup(popup, { x: styleInNum(popup, left), y: styleInNum(popup, top)}, { coords, reviews })
}

// utils
const styleInNum = (elem, property) => {
    return Number.parseFloat(window.getComputedStyle(elem)[property]);
}