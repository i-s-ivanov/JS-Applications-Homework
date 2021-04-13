function attachEvents() {
    document.getElementById('submit').addEventListener('click', async () => {
        let author = document.getElementById('author').value;
        let content = document.getElementById('content').value;

        await sendMessage({ author, content });

        document.getElementById('author').value = ''
        document.getElementById('content').value = ''

        getMessages()
    });

    document.getElementById('refresh').addEventListener('click', getMessages)

    getMessages()
}

attachEvents();

async function getMessages() {
    const url = 'http://localhost:3030/jsonstore/messenger';
    const response = await fetch(url);
    const data = await response.json();

    const textArea = document.getElementById('messages');


    let messages = Object.values(data).map(v => `${v.author}: ${v.content}`).join('\n')
    textArea.value = messages
}

async function sendMessage(message) {
    const url = 'http://localhost:3030/jsonstore/messenger';
    const response = await fetch(url, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
    });

}