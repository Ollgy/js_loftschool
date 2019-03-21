const styleInNum = (elem, property) => {
    return Number.parseFloat(window.getComputedStyle(elem)[property]);
}

const formattedTime = (now) => {
    const time = {
        year: now.getFullYear(),
        mounth: now.getMonth() + 1,
        date: now.getDate(),
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds()
    }

    return `${time.hours}`+
        `.${time.mounth > 9 ? time.mounth + 1 : '0' + (time.mounth)}` +
        `.${time.date > 9 ? time.date : '0' + time.date }` + 
        ` ${time.hours > 9 ? time.hours : '0' + time.hours }` +
        `:${time.minutes > 9 ? time.minutes : '0' + time.minutes }` +
        `:${time.seconds > 9 ? time.seconds : '0' + time.seconds }`;
}

const clearFields = (form) => {
    form.reset();
}

export { styleInNum, formattedTime, clearFields };
