
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Routes:
app.get('/', routes.index);

// Start server:
var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// Socket.IO:
var net = require('./public/js/net/common.js');

io = io.listen(server, { log: false });
io.sockets.on('connection', function (socket) {
  socket.emit(net.HELLO, { msg: 'Witaj' });
  console.log(net.REGISTER);

  socket.on(net.REGISTER, function (data) {
    console.log(net.REGISTER, data);
  });
});
