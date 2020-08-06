// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, '127.0.0.1', () => {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));


/*
 * connection, users-online, user-connected, new-message, user-info-changed, disconnected
 */


let users = [];

const getUserInfo = (socket) => {
    return {
        id: socket.conn.id,
        username: socket.handshake.query.username,
        // battery: socket.handshake.query.battery,
        // network: socket.handshake.query.network
    }
};

io.on('connection', (socket) => {
    users.push(socket);

    io.sockets.emit('users-online', users.map(getUserInfo));

//    socket.broadcast.emit('user-connected', getUserInfo(socket));

    socket.on('new-message', (payload) => {
        socket.broadcast.emit('new-message', {
            ...getUserInfo(socket),
            payload
        })
    });

    // socket.on('user-info-changed', (payload) => {
    //     socket.broadcast.emit('user-info-changed', {
    //         ...getUserInfo(socket),
    //         payload
    //     });
    // });

    socket.on('disconnect', (info) => {
        users = users.filter(user => user.id !== socket.conn.id);

        socket.broadcast.emit('user-disconnected', getUserInfo(socket));
    });
});
