const getGeocoderInfo = (coords) => {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();

        xhr.open(
            'GET', 
            `https://geocode-maps.yandex.ru/1.x/?apikey=ccd8c01e-3de3-453d-898e-ff4d72c9efd1&geocode=${coords[1]},${coords[0]}`,
            true
        );
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

export default getGeocoderInfo;