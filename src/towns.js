/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

function hideBlock(block) {
    block.style.display = 'none';
}

function showBlock(block) {
    block.style.display = 'block';
}

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов можно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    return new Promise(resolve => {

        const xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', true);
        xhr.send();

        xhr.onload = () => {
            if (xhr.status != 200) {
                loadingBlock.innerText = 'Не удалось загрузить города';
                showBlock(repeatButton);            
            } else {
                hideBlock(loadingBlock);
                hideBlock(repeatButton);
                showBlock(filterBlock);

                const response = JSON.parse(xhr.responseText).sort((a, b) => a.name > b.name ? 1 : -1);

                resolve(response);
            }
        }
    });
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    return full.toLowerCase().indexOf(chunk.toLowerCase()) > -1 ? true : false;
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');

const repeatButton = document.createElement('button');

repeatButton.innerText = 'Повторить';
repeatButton.onclick = loadTowns;

homeworkContainer.appendChild(repeatButton);
hideBlock(repeatButton);

/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

filterInput.addEventListener('keyup', function() {
    const str = filterInput.value;

    filterResult.innerHTML = '';

    if (!str) {
        return;
    }

    const list = document.createDocumentFragment();

    towns
        .map(el => el.name)
        .filter(town => isMatching(town, str))
        .forEach(town => {
            const li = document.createElement('div');

            li.innerText = town;
            list.appendChild(li);
        });
    
    if (list.children.length) {
        filterResult.appendChild(list);
    }

    // это обработчик нажатия кливиш в текстовом поле
});

let towns = [];

loadTowns().then(result => result.forEach(el => towns.push(el)));

export {
    loadTowns,
    isMatching
};
