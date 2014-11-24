var  WebSocketServer = require('ws').Server,
  http = require('http'),
  express = require('express');
  app = express();

app.use(express.static(__dirname + '/public'));

function start_server(port) {
	var server = http.createServer(app);

	server.listen(port);

	var wss = new WebSocketServer({server: server});

	wss.on('connection', function(ws) {
		var id = setInterval(function() {
			ws.send(new Date);
		}, 100);

		ws.on('close', function() {
			clearInterval(id);
		});
	});

	return server;
}

start_server(8080);
