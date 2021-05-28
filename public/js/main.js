const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const townName = document.getElementById('town-name');
const userList = document.getElementById('users');
const anchorName = document.getElementById('anchorname');
const spanName = document.getElementById('spanName');

// Get username and room from URL
const { username, town } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();

$('.msg').keyup(() => {
    socket.emit("nagtypeba", {
        name: username,
        typing: $('.msg').val().length > 0

    })
})

socket.on("nagtypeba", (data) => {
    $('.typing').html(data.typing ? `${data.name} is typing...` : '')
})

// Join chatroom
socket.emit('joinTown', { username, town });

socket.on('user', (user) => {
        anchorName.innerText = user;
        spanName.innerText = user;
    })
    // Get room and users
socket.on('townUsers', ({ town, users }) => {
    outputTownName(town);
    outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// private user

socket.on('privateChatUser',(user)=>{
    $('#chatHeader').text(user);
})
    

// private message (Dli pani makuha)
socket.on('messageUserInput', (msg) =>{
    console.log("hellllloooooooo????");
    console.log(msg);
    console.log(msg.username.username);
    duoMessage(msg);

})

// output Message for Private Message
 let messageBox = document.getElementById('message-box');

function duoMessage(msg){
    const createDiv = document.createElement('div');
    createDiv.classList.add('divStyle');
    const para2 = document.createElement('p');
    para2.classList.add('para2');
    para2.innerText = msg.text;
    const span = document.createElement('span');
    span.classList.add('span');
    span.innerText = msg.username.username;
    span.innerHTML += `<span style="margin-left:5px;">${msg.time}</span>`;
    createDiv.appendChild(para2);
    

    // if (message.username == username) {
    //     div.classList.add('user');
    // } else {     
    // }
    createDiv.appendChild(span);
    messageBox.appendChild(createDiv);
    $('#private_user_message').val('');
}

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


// Output message to DOM
function outputMessage(message) {

    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;

    if (message.username == username) {
        div.classList.add('user');
    } else {     
    }
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputTownName(town) {
    townName.innerText = town;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        // const li = document.createElement('li');
        // li.innerText = user.username;
        // userList.appendChild(li);
        $('#users').append(`<li><a type="submit" id="${user.username}" onclick="private(this.id)">${user.username}</a></li>`)
    });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveTown = confirm('Are you sure you want to leave the chatroom?');
    if (leaveTown) {
        window.location = '../index.html';
    } else {}
});


// privateMessage Div pop up
function private(user){   
    $('#privateMessageContainer').css('display','flex');
    socket.emit('privateUser',user);
}



let privateChat = document.getElementById('private_chat');

privateChat.addEventListener('submit', (e) => {
e.preventDefault();

// Get message text
let msg = $('#private_user_message').val();
msg = msg.trim();

if (!msg) {
    return false;
}

// Emit message to server
socket.emit('messageInput', msg);

// Clear input
msg.value = '';
});s