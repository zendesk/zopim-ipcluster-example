var  WebSocketServer = require('ws').Server,
  http = require('http'),
  express = require('express');
  app = express();

app.use(express.static(__dirname + '/public'));

function start_server(port) {
	var server = http.createServer(app);

	server.listen(port);

	var ws_server = new WebSocketServer({server: server});

	ws_server.on('connection', function(ws) {
		var id = setInterval(function() {
			ws.send('' + new Date);
		}, 100);

		ws.on('close', function() {
			clearInterval(id);
		});
	});

	return server;
}

var cluster = require('ipcluster');

var SETTINGS = {
	// UDS socket used for master-worker communications
	uds: process.cwd() + '/time.example.com.socket',

	// IP address
	current_ip: '10.151.137.146',

	// Number of active workers, must be power of 2
	// Optional, defaults to os.cpus().length
	num_workers: 4,

	// Maximum RSS before worker is retired
	// Optional
	retire_rss: 256 * 1024 * 1024,

	// Maximum memory cluster can use before retired workers are killed
	// Optional
	totalmaxheap: 512 * 1024 * 1024,

	// If false, worker console output goes to /dev/null
	debug: true
};

if (cluster.isMaster) {
	// Sets up master
	cluster.setupMaster(SETTINGS);
}
else {
	app = start_server();

	// Workers require additional options

	// Set up public -> worker ports
	SETTINGS.portmap = {};
	SETTINGS.portmap[80] = app.address().port;

	// Sets up worker
	cluster.setupWorker(SETTINGS);
}
