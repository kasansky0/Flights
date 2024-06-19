'use strict';

let flights = [ 
        {
            "id": 1,
            "name": "Flight # 1",
            "data": {
                "Date": "8 June, 2024",
                "Airplane type": "Boeing",
                "Hours": "19:00",
                "Price": "165",
                "Departure airport": "Paris",
                "Arrival airport": "Bordeaux",
                "Notes": "It was a good flight",
            },
            "target": 40
        },
        {
            "id": 2,
            "name": "Flight # 2",
            "data": {
                "Date": "",
                "Airplane type": "",
                "Hours": "",
                "Price": "11",
                "Departure airport": "",
                "Arrival airport": "",
                "Notes": "",
            },
            "target": 40
        }
];
const FLIGHT_KEY = 'FLIGHT_KEY';
const ACTIVE_FLIGHT_ID_KEY = 'ACTIVE_FLIGHT_ID_KEY';
let globalActiveFlightId;

const page = {
    days__list: document.querySelector('.days__list'),
    header: {
        h1: document.querySelector('h1'),
        progressPercent: document.querySelector('.progress__percent'),
        progressCoverBar: document.querySelector('.progress__cover-bar')
    },
    content: {
        day: document.querySelector('.day')
    },
    windows: document.querySelector('.windows')
}

/* utils */

function loadData() {
    const flightString = localStorage.getItem(FLIGHT_KEY);
    const flightArray = JSON.parse(flightString);
    if(Array.isArray(flightArray)) {
        flights = flightArray;
    }
    const activeFlightId = localStorage.getItem(ACTIVE_FLIGHT_ID_KEY);
    if (activeFlightId) {
        globalActiveFlightId = parseInt(activeFlightId, 10);
    }
}

function saveData() {
    localStorage.setItem(FLIGHT_KEY, JSON.stringify(flights));
}

function saveActiveFlightId() {
    localStorage.setItem(ACTIVE_FLIGHT_ID_KEY, globalActiveFlightId);
}

/* render */

function rerenderFlights(activeFlight) {
    page.days__list.innerHTML = '';
    for (const flight of flights) {
        const element = document.createElement('button');
        element.setAttribute('lesson-button-flight-id', flight.id);
        element.classList.add('lesson__button');
        element.innerText = `${flight.name}`;
        element.addEventListener('click', () => rerender(flight.id));
        
        if (activeFlight.id === flight.id) {
            element.classList.add('lesson_button_active');
        }

        page.days__list.appendChild(element);
    }
}

function rerenderHead(activeFlight) {
    page.header.h1.innerText = activeFlight.name;
    const progress = totalHours(flights) / activeFlight.target > 1 ? 100 : totalHours(flights) / activeFlight.target * 100;
    page.header.progressPercent.innerText = progress.toFixed(0) + '%';
    page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`);
}

function rerenderContent(activeFlight) {
    page.content.day.innerHTML = '';
    for(const ch in activeFlight.data) {
            const element = document.createElement('div');
            element.classList.add('date');
            const inputText = activeFlight.data[ch];
            const data = ch;
            if(data === 'Date') {
                element.innerHTML = `
            <div class="date_">${data}</div>
            <form class="date__input">
               <input name="comment" type="date" value="${inputText}" onchange="updateData('${data}', this.value)">
            </form>`;
            } else {
                element.innerHTML = `
            <div class="date_">${data}</div>
            <form class="date__input">
               <input name="comment" type="text" value="${inputText}" onchange="updateData('${data}', this.value)">
            </form>`;
            }

            page.content.day.appendChild(element);
    }
}

function updateData(key, value) {
    const activeFlight = flights.find(flight => flight.id === globalActiveFlightId);
    if(activeFlight) {
        activeFlight.data[key] = value;
        saveData();
    }
}

function addNewFlight() {
    const newFlight = {
        "id": flights.length + 1,
        "name": `Flight # ${flights.length + 1}`,
        "data": {
            "Date": "",
            "Airplane type": "",
            "Hours": "",
            "Price": "",
            "Departure airport": "",
            "Arrival airport": "",
            "Notes": "",
        },
        "target": 40
    }
    flights.push(newFlight);
    saveData();
    rerender(newFlight.id);
}

function deleteFlight() {
    if(flights.length > 0) {
        flights.pop();
        saveData();
        if(flights.length > 0) {
            globalActiveFlightId = flights[flights.length - 1].id;
            rerender(globalActiveFlightId);
        } else {
            globalActiveFlightId = null;
            clearUI();
        }
    }
}

function totalFlightHours() {
    const element = document.createElement('div');
    element.classList.add('money_spent');
    const total = flights.reduce((acc, current) => {
        if (current.data && current.data.Price) {
            const price = parseInt(current.data.Price);
            console.log(price);
            return acc + price;
        }
        return 0;
    }, 0);
    element.innerText = `Total: ${total} Euros`;
    page.windows.appendChild(element);
}

function totalFlightPrice() {
    const element = document.createElement('div');
    element.classList.add('money_spent');
    const total = flights.reduce((acc, current) => {
        if (current.data && current.data.Price) {
            const price = parseInt(current.data.Price);
            return acc + price;
        }
        return acc;
    }, 0);
    element.innerText = `Total: ${total} Euros`;
    page.windows.appendChild(element);
}

function totalHours(flights) {
    return flights.reduce((acc, current) => {
        if(current.data && current.data.Hours) {
            return acc + parseInt(current.data.Hours, 10);
        } else {
            return acc;
        }
        }, 0)
};

function totalFlightHours() {
    if(!Array.isArray(flights)) {
        console.log('Flight is not defined');
        return;
    }
    const total = totalHours(flights);
    const element = document.createElement('div');
    element.classList.add('flight_hours_');
    element.innerText = `Total: ${total} Hours`;
    page.windows.appendChild(element);
    if (page && page.windows && page.windows.appendChild) {
        page.windows.appendChild(element);
    } else {
        console.error('page.windows is not defined or is not an element');
    }
}

function clearUI() {
    page.days__list.innerHTML = '';
    page.header.h1.innerText = 'No flights available';
    page.header.progressPercent.innerText = '0%';
    page.header.progressCoverBar.setAttribute('style', 'width: 0%');
    page.content.day.innerHTML = '<p>No flight data available</p>';
}

function rerender(activeFlightId) {
    globalActiveFlightId = activeFlightId;
    saveActiveFlightId();
    const activeFlight = flights.find(flight => flight.id === activeFlightId);
    if(!activeFlight) {
        return;
    }
    if(!page.days__list) {
        console.log('page.days__list is not defined');
    }
    rerenderFlights(activeFlight);
    rerenderHead(activeFlight);
    rerenderContent(activeFlight);
}

/* init */

(() => {
    loadData();
    if (flights.length > 0) {
        if (globalActiveFlightId) {
            rerender(globalActiveFlightId);
        } else {
            rerender(flights[0].id);
        }
    } else {
        clearUI();
    }    
    saveData();
    totalFlightHours();
    totalFlightPrice();
})()