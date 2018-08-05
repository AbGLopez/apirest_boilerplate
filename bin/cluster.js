"use strict";
const cluster = require('cluster');

if (cluster.isMaster){
	console.log(`Starting master ${process.pid}`)
	// Create Workers
	const numCPUs = require('os').cpus()
		.forEach((cpu) => {
			forkWorker();
		});

	cluster.on('online', (worker) => {
		console.log(`worker ${worker.id} online (pid ${worker.process.pid})`);
	})
	// Always all worker up!
	cluster.on('exit', (worker, code, signal) => {
		console.log(`Worker PID ${worker.process.pid} died with code ${code} and signal ${signal}`);
		console.log('Forking worker...')
		forkWorker();
	});


}else{
	require('./www');
}

function forkWorker() {
	const worker = cluster.fork();
	worker.on('message', message => {
		if (message === 'restart') {
			console.log('Restarting all workers');
			restartAllWorkers();
		}
	})
}

function restartAllWorkers() {
	let seconds = 0;
	for (let id in cluster.workers) {
		const worker = cluster.worker[id];
		
		let setTimeout;
		
		setTimeout(() =>{
			worker.disconnect();
			timeout = setTimeout(()=> worker.kill(), 1000);

		}, ++seconds * 1000)

		worker.on('disconnect', () => {
			clearTimeout(timeout);

		})

		
	}

}