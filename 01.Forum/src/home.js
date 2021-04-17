import { e } from './dom.js'
import { showCreate } from './create.js'


export function showHome() {
    const main = document.querySelector('main');
    main.innerHTML = '';
    const div = e('div', { className: 'new-topic-border' })
    div.innerHTML = `
    <div class="header-background">
        <span>New Topic</span>
    </div>
    <form>
        <div class="new-topic-title">
            <label for="topicName">Title <span class="red">*</span></label>
            <input type="text" name="topicName" id="topicName">
        </div>
        <div class="new-topic-title">
            <label for="username">Username <span class="red">*</span></label>
            <input type="text" name="username" id="username">
        </div>
        <div class="new-topic-content">
            <label for="postText">Post <span class="red">*</span></label>
            <textarea type="text" name="postText" id="postText" rows="8" class="height"></textarea>
        </div>
        <div class="new-topic-buttons">
            <button class="cancel">Cancel</button>
            <button class="public">Post</button>
        </div>
    </form>`

    main.appendChild(div)
    const topicsContainer = e('div', { className: 'topic-title' })
    main.appendChild(topicsContainer);
    const form = document.querySelector('.new-topic-border form')
    const submitBtn = form.querySelector('.public');
    const cancelBtn = form.querySelector('.cancel');

    submitBtn.addEventListener('click', onSubmit);
    cancelBtn.addEventListener('click', cancelForm);
    getPosts();
}

async function getPosts() {
    const topicTitle = document.querySelector('.topic-title');
    topicTitle.innerHTML = ''
    const response = await fetch('http://localhost:3030/jsonstore/collections/myboard/posts');
    if (!response.ok) {
        const error = await response.json();
        return alert(error.message)
    }
    const data = await response.json();
    Object.values(data).forEach(p => topicTitle.appendChild(createPost(p)))
}

function createPost(p) {
    const topic = e('div', { className: 'topic-container' },
        e('div', { className: 'topic-name-wrapper' },
            e('div', { className: 'topic-name' },
                e('a', { className: 'normal', href: '#' },
                    e('h2', {}, p.topicName)
                ),
                e('div', { className: 'columns' },
                    e('div', {},
                        e('p', {}, `Date: ${p.date}`),
                        e('div', { className: 'nick-name' },
                            e('p', {}, 'Username:', e('span', {}, p.username))
                        ),
                    ),
                    e('div', { className: 'subscribers' },
                        e('p', {}, 'Subscribers:', e('span', {}, '0'))
                    )
                ),
                e('input', { type: 'hidden' }, p._id)
            )
        )
    );
    topic.querySelector('.normal').addEventListener('click', () => showCreate(p._id));
    return topic;
}

async function onSubmit(event){
    event.preventDefault();
    const form = document.querySelector('.new-topic-border form');
    const d = new Date;
    const formData = new FormData(form);
    const comment = {
        topicName: formData.get('topicName'),
        username: formData.get('username'),
        postText: formData.get('postText'),
        date: d
    };
    if(comment.topicName == ''|| comment.username == ''|| comment.postText == ''){
        return alert('All fields are required!');
    }
    const response = await fetch('http://localhost:3030/jsonstore/collections/myboard/posts', {
        method:'post',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(comment)
    });
    if (response.ok) {       
        const data = await response.json();
        postFirstComment(data._id, comment);
        form.reset();
        getPosts();
    }else{
        const error = response.json();
        alert (error.message);
    }
}

async function postFirstComment(id, c){
    const comment = {
        username: c.username,
        postText: c.postText,
        date: c.date,
        postId: id
    };
    const response = await fetch('http://localhost:3030/jsonstore/collections/myboard/comments', {
        method:'post',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(comment)
    });
    if (response.ok) {
        return
    }else{
        const error = response.json();
        alert (error.message);
    }
}
function cancelForm(event){
    event.preventDefault();
    const form = document.querySelector('.new-topic-border form');
    form.reset();
}