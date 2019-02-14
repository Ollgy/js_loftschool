/* ДЗ 2 - работа с массивами и объеектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
const forEach = (array, fn) => {
    for (let i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }

    return array;
}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
const map = (array, fn) => {
    let newArr = [];

    for (let i = 0; i < array.length; i++) {
        newArr.push(fn(array[i], i, array));
    }

    return newArr;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
const reduce = (array, fn, initial) => {
    let res, i;

    if (initial === undefined) {
        res = array[0];
        i = 1;
    } else {
        res = initial;
        i = 0;
    }  

    for (i; i < array.length; i++) {
        res = fn(res, array[i], i, array);
    }

    return res;
}

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
const upperProps = (obj) => {
    let newProps = [];

    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            newProps.push(prop.toUpperCase())
        }
    }

    return newProps;
}

/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
const slice = (array, from, to) => {
    let newArr = [];
    const length = array.length;

    if (from === undefined) {
        from = 0;
    }

    if (to === undefined || to > length) {
        to = length;
    }

    if (from < 0) {
        from = length + from;
    }

    if (to < 0) {
        to = length + to;
    }
    
    for (let i = 0; i < length; i++) {
        if (i >= from && i < to) {
            newArr.push(array[i]);
        }
    }

    return newArr;
}

/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    return new Proxy(obj, {
        set(target, prop, value) {
            target[prop] = +value * +value;

            return true;
        }
    });
}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
