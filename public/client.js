document.addEventListener('DOMContentLoaded', () => {
    const username = prompt('Как вас зовут?');

    const socket = io(`?username=${username}`);

    let users = [];

    const renderUsers = () => {
        const content = users.map(user => `<li>${user.username}</li>`).join('');

        document.querySelector('#users').innerHTML = content;
    };


    const renderMessage = (username, content) => {
        const htmlContent = `<li><strong>${username}</strong>: ${content}</li>`;

        document.querySelector('#messages').innerHTML+= htmlContent;
    };


    socket.on('users-online', (data) => {
         users = data;

         console.log(data);

         renderUsers();
    });

    document.querySelector('#btn-send-message').addEventListener('click', (event) => {
        event.preventDefault();

        const message = document.querySelector('#message').value;

        document.querySelector('#message').value = '';

        socket.emit('new-message', {
            message
        });

        renderMessage(username, message);
    });

    socket.on('new-message', (data) => {
        renderMessage(data.username, data.payload.message);
    })



});
