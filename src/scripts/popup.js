
import getGeocoderInfo from './geocoder.js';
import { styleInNum } from './utils.js';

const setAddress = (coords, block) => {
    return getGeocoderInfo(coords).then(result => 
        block.innerText = result.querySelector('formatted').textContent + ''
    );
} 

const addReview = (data, parent) => {
    if (parent.firstChild && parent.firstChild.nodeType === 3) {
        parent.firstChild.remove();
    }

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

const showPopup = (popup, pos, data) => {
    const list = popup.querySelector('#list');

    if (!popup.classList.contains('hidden')) {
        popup.classList.add('hidden')
    }

    if (data.reviews.length) {
        list.innerText = ' ';

        const fr = document.createDocumentFragment();

        data.reviews.forEach(review => addReview(review, fr));
        list.appendChild(fr);
    } else {
        list.innerText = 'Отзывов пока нет...'
    }

    setAddress(data.coords, popup.querySelector('.header__place')).then(() => {
        popup.style.top = pos.y + styleInNum(popup, 'height') > window.innerHeight 
            ? `${window.innerHeight - styleInNum(popup, 'height')}px` 
            : `${pos.y}px`;
        popup.style.left = pos.x + styleInNum(popup, 'width') > window.innerWidth 
            ? `${window.innerWidth - styleInNum(popup, 'width')}px` 
            : `${pos.x}px`;
        popup.classList.remove('hidden');
    });
}

const showPopupAddressQuery = (e, popup, list) => {
    e.preventDefault();

    const address = e.target.innerText;
    const translated = 150;

    const reviews = list
        .filter(obj => obj.address === address)
        .map(obj => obj.reviews)
        .reduce((acc, elem) => acc.concat(elem), []);
    const coords = list.filter(obj => obj.address === address)[0].coords;
        
    showPopup(
        popup, 
        { x: e.target.getBoundingClientRect().left, y: e.target.getBoundingClientRect().top + translated }, 
        { coords, reviews }
    );
}

export { showPopup, showPopupAddressQuery, addReview };

