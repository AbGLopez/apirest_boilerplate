"use strict"

const mongoose = require('mongoose');
const conn = mongoose.connection;

mongoose.Promise = global.Promise;

conn.on('error', err => {
	console.log('Error de conexión', err);
	process.exit(1);
});

conn.once('open', () => {
	console.log('Conectado a MongoDB.');
});

const dbName = 'apiv1';
console.log('enviroment ' ,process.env.ENVIRONMENT);

// if (process.env.ENVIRONMENT === 'dev') {
//     mongoose.connect(`mongodb://localhost/${dbName}`);
// 	console.log('#######  MODO DESARROLLADOR #######');
// } else if (process.env.ENVIRONMENT === 'docker') {
// 	console.log('#######  MODO DESARROLLADOR #######');
// 	mongoose.connect(`mongodb://mongo/${dbName}`);
// }else {
// 	mongoose.connect(`mongodb://mongo/${dbName}`);
// 	console.log('#######  Producción #######');
// }
mongoose.connect('mongodb://localhost/apìv1');