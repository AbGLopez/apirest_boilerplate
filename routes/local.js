var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	// "Securize cluster"
	if (req.hostname !== 'localhost'){
		return next();
	}
	// Trick for kill process and update application without lose service.
	if (req.query.c === 'suicide') {
		process.nextTick(() => {
			process.exit(0);
		})
	}
	if (req.query.c === 'restart') {
		process.nextTick(() => {
			process.send('restart');
		})
	}
	res.send('ok');
});

module.exports = router;
