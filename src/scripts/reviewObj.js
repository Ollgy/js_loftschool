export default class ReviewObj {
    constructor (parent, coords, pos, data) {
        this.coords = coords;
        this.address = parent.querySelector('.header__place').innerText;
        this.pos = pos;
        this.reviews = data;
    }
}