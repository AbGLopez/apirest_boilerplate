'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = require('../../models/User');
// const jwtAuth = require('../../lib/jwtAuth');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('../../lib/validators');
const cors = require('cors');


router.post('/singup', (req, res, next) => {
// 	curl --header "Content-Type: application/json" \
//   --request POST \
//   --data '{"email":"peper@gmail.com","password":"peper1234", "name": "Peper"}' \
//   http://localhost:3000/apiv1/users/singup

let validationResult = validator.multipleValidations({ email: req.body.email, password: req.body.password });

if (!validationResult.success) {
	res.json({ status: 400, resultDescription: validationResult.result, result: undefined });
	return;
}

	User.find({ email: req.body.email }).exec()
		.then((values) => {
			let user
			// The email exists
			if (values.length > 0) {
				user = values[0]
				// If the email is active
				if (user.isActive) {
					res.json({ status: 403, resultDescription: 'The email exists. It can\'t be inserted', result: undefined });
				} else {
					// Reactivate the user
					user.name = req.body.name ? req.body.name : user.name
					user.lastReactivatedDate = new Date();
					user.isActive = true;
					User.update({ email: user.email }, user).exec()
						.then(() => {
							res.json({ status: 201, resultDescription: 'User reactivated', result: user });
						})
						.catch((err) => {
							next(err);
						});
				}
				return;
			} else {
				let validationResult = validator.multipleValidations({ name: req.body.name });

				if (!validationResult.success) {
					res.json({ status: 400, resultDescription: validationResult.result, result: undefined });
					return;
				}

				// Create an User document
				user = new User(req.body);
				user.password = bcrypt.hashSync(user.password, 10);
				user.creationDate = new Date();
				user.lastDeletedDate = undefined;
				user.lastModifiedDate = undefined;
				user.lastReactivatedDate = undefined;
				user.isActive = true;
				// Save the user
				user.save((err, savedUser) => {
					if (err) {
						next(err);
						return;
					}
					res.json({ status: 201, resultDescription: 'User registered', result: savedUser });
					return;
				});
			}
		})
		.catch((err) => {
			next(err);
			return;
		});
});

// 	curl "http://localhost:3000/apiv1/users/singin?email=peper@gmail.com&password=peper1234"
router.get('/signin', (req, res, next) => {
	console.log('req', req.query);
	console.log('req.query.password',req.query.password);
	console.log('req.query.email',req.query.email);
	let validationResult = validator.multipleValidations({ email: req.query.email, password: req.query.password });
	console.log('validationResult', validationResult);

	if (!validationResult.success) {
		res.json({ status: 400, resultDescription: validationResult.result, result: undefined });
		return;
	}

	User.find({ email: req.query.email }).exec()
		.then((values) => {
			switch (values.length) {
				case 0:
					res.json({ status: 404, resultDescription: 'Email not found', result: undefined });
					break;
				case 1:
					const user = values[0];
					if (!user.isActive) {
						res.json({ status: 403, resultDescription: 'Deleted user', result: undefined });
					} else {
						if (bcrypt.compareSync(req.query.password, user.password)) {
							// let token = jwt.sign({ email: req.query.email }, validator.getSecretKey(), { expiresIn: '24h' });
							res.json({ status: 200,
									//   resultDescription: token,
									   result: undefined
									});
						} else {
							res.json({ status: 403, resultDescription: 'Error authentication. Wrong password', result: undefined });
						}
					}
					break;
				default:
					res.json({ status: 403, resultDescription: 'More than one user', result: undefined });
					break;
			}
			return;
		})
		.catch((err) => {
			next(err);
			return;
		});
});


module.exports = router;
