// vim: tabstop=4 shiftwidth=0 noexpandtab
"use strict";
let fs = require('fs');
var https = require('https');
//var mod = require('module');
//modules = modules || {};
try {
	require('./config.js');
} catch (e) {
	if (e.code !== 'MODULE_NOT_FOUND') {
		throw e;
	}
	console.log('Rename file config.js.example to config.js and put your credentials there.');
	process.exit(1);
}

// Read local code from disk
let files = {};
fs.readdirSync('.').forEach(function(file) {
		if (file !== 'sync.js' && file !== 'config.js' && /\.js$/.test(file)) {
				files[file.replace( /\.js$/, '')] = fs.readFileSync(file, 'utf8');
		}
});
//files['last-push'] = 'module.exports='+ Date.now()+ ';';

var email = 'jarymut+screeps@gmail.com',
	password = 'I.am.a.coding.GOD.1',
	data = {
		branch: 'default',
		modules: files
	};

var req = https.request({
	hostname: 'screeps.com',
	port: 443,
	path: '/api/user/code',
	method: 'POST',
	auth: email + ':' + password,
	headers: {
		'Content-Type': 'application/json; charset=utf-8'
	}
});

req.write(JSON.stringify(data));
req.end();
req.on('response', function(res) {
			console.log('HTTP Status '+ res.statusCode);
});

