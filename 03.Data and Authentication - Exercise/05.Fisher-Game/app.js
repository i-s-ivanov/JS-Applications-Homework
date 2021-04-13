function attachEvents() {
    document.querySelector('.load').addEventListener('click', loadCatches)
    const addBtn = document.getElementById('addCatchBtn');
    const logged = document.getElementById('logged')
    const guest = document.getElementById('guest')
    addBtn.addEventListener('click', addCatch)


    if (sessionStorage.getItem('token') == null) {
        addBtn.disabled = true;
        logged.style.display = 'none';
        guest.style.display = 'inline-block'
    } else {
        addBtn.disabled = false
        logged.style.display = 'inline-block'
        guest.style.display = 'none'
    }

    document.getElementById('logged').addEventListener('click', () => {
        sessionStorage.clear()
    })


    loadCatches()
}

attachEvents();


async function loadCatches() {
    const url = 'http://localhost:3030/data/catches';
    const catches = await request(url);

    const displayCatches = document.getElementById('catches')
    displayCatches.innerHTML = ''

    catches.forEach(c => {
        const div = e('div', { className: 'catch', id: c._id })

        const anglerLabel = e('label', {}, 'Angler')
        const anglerInput = e('input', { type: 'text', className: 'angler', value: c.angler })
        const anglerHr = e('hr');

        const weightLabel = e('label', {}, 'Weight')
        const weightInput = e('input', { type: 'number', className: 'weight', value: c.weight })
        const weightHr = e('hr')

        const speciesLabel = e('label', {}, 'Species')
        const speciesInput = e('input', { type: 'text', className: 'species', value: c.species })
        const speciesHr = e('hr')

        const locationLabel = e('label', {}, 'Location')
        const locationInput = e('input', { type: 'text', className: 'location', value: c.location })
        const locationHr = e('hr')

        const baitLabel = e('label', {}, 'Bait')
        const baitInput = e('input', { type: 'text', className: 'bait', value: c.bait })
        const baitHr = e('hr')

        const captureTimeLabel = e('label', {}, 'Capture Time')
        const captureTimeInput = e('input', { type: 'number', className: 'captureTime', value: c.captureTime })
        const captureTimeHr = e('hr')

        const updateBtn = e('button', { disabled: true, className: 'update' }, 'Update')
        const deleteBtn = e('button', { disabled: true, className: 'delete' }, 'Delete')

        div.append(anglerLabel, anglerInput, anglerHr, weightLabel, weightInput, weightHr, speciesLabel, speciesInput, speciesHr,
            locationLabel, locationInput, locationHr, baitLabel, baitInput, baitHr, captureTimeLabel, captureTimeInput, captureTimeHr,
            updateBtn, deleteBtn)


        if (c._ownerId == sessionStorage.getItem('id')) {
            updateBtn.disabled = false
            deleteBtn.disabled = false
        }
        updateBtn.addEventListener('click', updateCatch)
        deleteBtn.addEventListener('click', deleteCatch)

        displayCatches.appendChild(div)
    })

}

async function addCatch(event) {
    const inputs = document.getElementById('addForm').querySelectorAll('input')
    const values = [...inputs].map(el => el.value)
    const [angler, weight, species, location, bait, capture] = values;

    if (!angler || !weight || !species || !location || !bait || !capture) {
        return alert('All fields are required!')
    }

    const newCatch = { angler, weight: Number(weight), species, location, bait, captureTime: Number(capture) }
    await request('http://localhost:3030/data/catches', {
        method: 'post',
        headers: { 'Content-Type': 'application.json', 'X-Authorization': `${sessionStorage.getItem('token')}` },
        body: JSON.stringify(newCatch)
    })
    inputs.forEach((i) => (i.value = ''));
    loadCatches()
}

async function updateCatch(event) {
    const token = sessionStorage.getItem('token');
    const catchId = event.target.parentNode.id;
    const [angler, weight, species, location, bait, capture] = [
        ...event.target.parentNode.querySelectorAll('input'),
    ].map((el) => el.value);

    const newCatch = { angler, weight: Number(weight), species, location, bait, captureTime: Number(capture) }

    await request('http://localhost:3030/data/catches/' + catchId, {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'X-Authorization': token },
        body: JSON.stringify(newCatch)
    })
    loadCatches()
}

async function deleteCatch(event) {
    const token = sessionStorage.getItem('token')
    const catchId = event.target.parentNode.id;
    const confirmed = confirm('Are you sure you want to delete this catch?');

    if (confirmed) {
        await request('http://localhost:3030/data/catches/' + catchId, {
            method: 'delete',
            headers: { 'X-Authorization': token }
        })
        loadCatches()
    }



}


async function request(url, options) {
    try {
        const response = await fetch(url, options);
        if (response.ok == false) {
            const error = await response.json();
            alert(error.message);
            throw new Error(error.message);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        alert(error);
        throw new Error(error);
    }
}

function e(type, attributes, ...content) {
    const result = document.createElement(type);

    for (let [attr, value] of Object.entries(attributes || {})) {
        if (attr.substring(0, 2) == 'on') {
            result.addEventListener(attr.substring(2).toLocaleLowerCase(), value);
        } else {
            result[attr] = value;
        }
    }

    content = content.reduce((a, c) => a.concat(Array.isArray(c) ? c : [c]), [])

    content.forEach(e => {
        if (typeof e == 'string' || typeof e == 'number') {
            const node = document.createTextNode(e);
            result.appendChild(node);
        } else {
            result.appendChild(e)
        }
    });

    return result
}

