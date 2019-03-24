var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.emit('some event', { for: 'everyone' });
io.on('connection', function(socket){
  socket.broadcast.emit('hi');
  socket.on('disconnect', function(name){
    io.emit('disconnect', name);
  })
});

io.on('connection', function(socket){
  socket.on('message', function(msg){
    io.emit('message', msg);
  });

  socket.on('addUser', function(quantity){
    io.emit('addUser', quantity);
  });

  socket.on('disconnectUser', function(name){
    io.emit('disconnectUser', name);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
