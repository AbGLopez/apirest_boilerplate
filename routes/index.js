"use strict";

var express = require('express');
var router = express.Router();
var sleep = require('sleep');
var crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


// Eval concurrency con siege: siege -c 20 -r 5 http://localhost:3000/sleep
router.get('/sleep', function (req, res) {
	// 	Simulamos retraso en procesado de rutas
	var randSleep = Math.round(10 + (Math.random() * 10))
	// Bloquea el evenloop, no es asincrono
	sleep.msleep(randSleep);

	// Simulamos las llamadas a DB
	var numChars = Math.round(5000 + (Math.random() * 10))
	var randChars = crypto.randomBytes(numChars).toString()
	res.send(randChars);

})



module.exports = router;
