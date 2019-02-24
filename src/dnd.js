/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
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

/*
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
 */
function createDiv() {
    const div = document.createElement('div');
    
    const w = Math.floor(Math.random() * (150 - 30 + 1)) + 30;
    const h = Math.floor(Math.random() * (150 - 30 + 1)) + 30;
    const color = '#' + ('000000' + Math.floor(Math.random() * 0xFFFFFF).toString(16)).substr(-6);
    
    const parentW = Number.parseFloat(document.documentElement.clientWidth);
    const parentH = Number.parseFloat(document.documentElement.clientHeight);
    
    div.style.position = 'absolute';
    div.style.top = `${Math.floor((Math.random() * (parentH - h)))}px` ;
    div.style.left = `${Math.floor((Math.random() * (parentW - w)))}px`;
    div.style.width = `${w}px`;
    div.style.height = `${h}px`;
    div.style.backgroundColor = color;
    div.style.borderRadius = '10px';

    div.onmouseover = () => { 
        div.style.cursor = 'pointer' 
    };
    
    div.classList.add('draggable-div');
    
    return div;
}

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
   addListeners(newDiv);
 */
function addListeners(parent) {

    const getMouseCoordinate = (e) => {
        return { top: e.pageY, left: e.pageX }
    }

    const setElemCoordinate = (obj, coord) => {
        obj.style.top = `${coord.top}px`;
        obj.style.left = `${coord.left}px`;
    }

    const mouseOnElem = (obj, e) => {

        const mousePos = getMouseCoordinate(e);

        return mousePos.top > obj.getBoundingClientRect().top 
            && mousePos.top < obj.getBoundingClientRect().bottom
            && mousePos.left > obj.getBoundingClientRect().left 
            && mousePos.left < obj.getBoundingClientRect().right
    }

    let eDragStart, eDragMove, target;

    const handleDragStart = (e) => {
        console.log('start');
        target = e.target;
        target.style.opacity = '0.4';
        target.style.cursor = 'move';

        if (mouseOnElem(target, e)) {
            eDragStart = e;

            setDragListener();
        }
    }

    const handleDragEnd = () => {
        console.log('end');
        target.style.cursor = 'pointer';
        target.style.opacity = '1';

        removeDragListener();
    }

    const handleDrag = (e) => {

        eDragMove = e;

        const mousePos = getMouseCoordinate(eDragMove);

        const mouseOffset = {
            top: eDragStart.offsetY,
            left: eDragStart.offsetX
        }

        const newCoord = {};
        const newY = mousePos.top - mouseOffset.top;
        const newX = mousePos.left - mouseOffset.left;
        const limitX = document.documentElement.clientWidth - target.clientWidth;
        const limitY = document.documentElement.clientHeight - target.clientHeight;

        if (newY > 0 && newY < limitY) {
            newCoord.top = newY;
        } else if (newY < 0) {
            newCoord.top = 0;
        } else if (newY < limitY) {
            newCoord.top = limitY;
        }

        if (newX > 0 && newX < limitX) {
            newCoord.left = newX;
        } else if (newX < 0) {
            newCoord.left= 0;
        } else if (newX < limitX) {
            newCoord.left = limitX;
        }
    
        setElemCoordinate(target, newCoord);
    }

    function setDragListener() {
        document.addEventListener('mousemove', handleDrag); 
    }

    function removeDragListener() {
        document.removeEventListener('mousemove', handleDrag); 
    }
    
    parent.addEventListener('mousedown', handleDragStart);
    parent.addEventListener('mouseup', handleDragEnd);
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    const div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);

    // назначить обработчики событий мыши для реализации D&D
    addListeners(document.body);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
