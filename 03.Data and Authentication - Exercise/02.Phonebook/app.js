function attachEvents() {
    document.getElementById('btnLoad').addEventListener('click', () => {
        document.getElementById('phonebook').innerHTML = ''
        loadPhonebook()
    })
    document.getElementById('btnCreate').addEventListener('click', async () => {
        const person = document.getElementById('person').value;
        const phone = document.getElementById('phone').value;

        if (person != '' && phone != '') {
            await createContact({ person, phone });
            document.getElementById('person').value = ''
            document.getElementById('phone').value = ''

            document.getElementById('phonebook').innerHTML = ''
            loadPhonebook() // за да рефрешне автоматично
        }
    })
}

attachEvents();

async function loadPhonebook() {
    const url = 'http://localhost:3030/jsonstore/phonebook';
    const response = await fetch(url)
    const data = await response.json()

    Object.values(data).forEach(object => {
        const ul = document.getElementById('phonebook');
        const li = document.createElement('li')
        li.textContent = `${object.person}: ${object.phone}`
        const delBtn = document.createElement('button')
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', async () => {
            await deleteContact(object._id)
            document.getElementById('phonebook').innerHTML = ''
            loadPhonebook() // за да рефрешне автоматично
        })

        li.appendChild(delBtn)
        ul.appendChild(li)
    })
}

async function createContact(info) {
    const url = 'http://localhost:3030/jsonstore/phonebook';
    const response = await fetch(url, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
    })
}

async function deleteContact(id) {
    const url = 'http://localhost:3030/jsonstore/phonebook/' + id;
    const response = await fetch(url, {
        method: 'delete'
    })
}