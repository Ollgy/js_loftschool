/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');
// получение массива cookies
const getCookiesList = () => {
    return document.cookie.split('; ')
        .reduce((prev, cookie) => { 
            const [name, value] = cookie.split('=');

            prev[name] = value;

            return prev;
        }, {});
}

const saveCookie = (name, value, expires) => {
    let exp = expires || 0;

    document.cookie = `${name}=${value}${expires ? `; expires=${exp}` : ''}`;
}

const deleteCookie = (name) => {
    const time = new Date();

    time.setTime(time.getTime() - 1);

    saveCookie(name, '', time.toGMTString());
}

const addTableRow = (name, value) => {
    const newRow = document.createElement('tr');
    const removeButton = document.createElement('button');
    
    newRow.setAttribute('data-name', name);

    removeButton.innerText = 'Удалить';
    removeButton.addEventListener('click', () => {
        removeButton.parentNode.parentNode.remove();
        deleteCookie(name);
    });

    listTable.appendChild(newRow);

    [name, value, removeButton].forEach((elem) => {
        const column = document.createElement('td');

        elem === removeButton 
            ? column.appendChild(elem)
            : column.innerText = elem;
        newRow.appendChild(column);
    });
}

function isMatching(full, chunk) {
    return full.toLowerCase().indexOf(chunk.toLowerCase()) > -1 ? true : false;
}

filterNameInput.addEventListener('keyup', function() {
    const str = filterNameInput.value;
    const cookies = getCookiesList();

    if (!listTable.children) {
        return;
    }

    [...listTable.children]
        .forEach(child => child.remove());
       
    for (let name in cookies) {
        if (isMatching(name, str) || isMatching(cookies[name], str)) {
            addTableRow(name, cookies[name]);
        } 
    }
    
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
});

addButton.addEventListener('click', () => {
    const name = addNameInput.value;
    const value = addValueInput.value;
    const str = filterNameInput.value;
    
    if (getCookiesList()[name]) {
        saveCookie(name, value);
        
        const curRow = [...listTable.children].find(child => child.dataset.name === name);

        curRow.children[1].innerText = value;

        if (!isMatching(name, str) && !isMatching(value, str)) {
            curRow.remove();
        }

        return;
    }

    saveCookie(name, value);

    if (isMatching(name, str) || isMatching(value, str)) {
        addTableRow(name, value);
    }
   
    // здесь можно обработать нажатие на кнопку "добавить cookie"
});