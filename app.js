'use strict';

let flights = [ 
        {
            "id": 1,
            "name": "Flight # 1",
            "data": {
                "Date": "8 June, 2024",
                "Airplane type": "Boeing",
                "Time start": "19:00",
                "Flight price": "165 euros",
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
                "Time start": "",
                "Flight price": "",
                "Departure airport": "",
                "Arrival airport": "",
                "Notes": "",
            },
            "target": 40
        }
];
const FLIGHT_KEY = 'FLIGHT_KEY';
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
    }
}

/* utils */

function loadData() {
    const flightString = localStorage.getItem(FLIGHT_KEY);
    const flightArray = JSON.parse(flightString);
    if(Array.isArray(flightArray)) {
        flights = flightArray;
    }
}

function saveData() {
    localStorage.setItem(FLIGHT_KEY, JSON.stringify(flights));
}

/* render */

function rerenderFlights(activeFlight) {
    page.days__list.innerHTML = '';
    for(const flight of flights) {
        const existed = document.querySelector(`[lesson-button-flight-id="${flight.id}"]`);
        if(!existed) {
            const element = document.createElement('button');
            element.setAttribute('lesson-button-flight-id', flight.id);
            element.classList.add('lesson__button');
            element.innerText = `${flight.name}`;
            element.addEventListener('click', () => rerender(flight.id));
            if(activeFlight.id === flight.id) {
                element.classList.add('lesson-button-flight-id');
            }
            page.days__list.appendChild(element);
            continue;
        }
        if(activeFlight.id === flight.id) {
            existed.classList.add('lesson_button_active');
        } else {
            existed.classList.remove('lesson_button_active');
        }
    }
}

function rerenderHead(activeFlight) {
    page.header.h1.innerText = activeFlight.name;
    const progress = flights.length / activeFlight.target > 1 ? 100 : flights.length / activeFlight.target * 100;
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
            element.innerHTML = `
            <div class="date_">${data}</div>
            <form class="date__input">
                <input name="comment" type="text" value="${inputText}" onchange="updateData('${data}', this.value)">
            </form>`;

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
            "Time start": "",
            "Flight price": "",
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

function clearUI() {
    page.days__list.innerHTML = '';
    page.header.h1.innerText = 'No flights available';
    page.header.progressPercent.innerText = '0%';
    page.header.progressCoverBar.setAttribute('style', 'width: 0%');
    page.content.day.innerHTML = '<p>No flight data available</p>';
}

function rerender(activeFlightId) {
    globalActiveFlightId = activeFlightId;
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
    saveData();
    rerender(flights[0].id);
})()