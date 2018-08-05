"use strict"

// const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');
const emailValidator = require('email-validator');
// const myJson = require('./secrets.json');
const validUrl = require('valid-url');
const User = require('../models/User');
const constants = require('./constants');
const path = require('path');

// Create a schema 
var schema = new passwordValidator();

// Add properties to it 
schema
	.is().min(8)                                    // Minimum length 8
// .is().max(100)                                  // Maximum length 100
// .has().uppercase()                              // Must have uppercase letters
// .has().lowercase()                              // Must have lowercase letters
// .has().digits()                                  // Must have digits
// .has().not().spaces();                          // Should not have spaces

// function getSecretKey() {
// 	return myJson.key;
// }

function emailIsValid(key, email) {
	let good = { success: true, result: 'The ' + key + ' is valid' },
		bad = { success: false, result: 'The ' + key + ' is not valid' };
	return emailValidator.validate(email) ? good : bad;
}

function nameIsValid(key, name) {
	let good = { success: true, result: 'The ' + key + ' is valid' },
		bad = { success: false, result: key + ' too short. Must be at least 3 character' };
	return name.length >= 3 ? good : bad;
}

function passwordIsValid(password) {
	return !schema.validate(password) ? { success: false, result: schema.validate(password, { list: true }) } : { success: true, result: 'The password is valid' };
}

function urlIsValid(url) {
	let good = { success: true, result: 'The URL is valid' },
		bad = { success: false, result: 'The URL is not a secure URI' };
	return validUrl.isHttpsUri(url) ? good : bad;
}

function acceptedExtensionForImageFile(imageFile) {
	let fileParts = path.extname(imageFile.originalname).split('.');
	let fileExtension = fileParts[fileParts.length - 1];

	let good = { success: true, result: 'Successful validation. Accepted extension for image file' },
		bad = { success: false, result: fileExtension + ' is not accepted like an image file extension' };
	return constants.imageExtensionsAccepted.indexOf(fileExtension) > -1 ? good : bad;
}


function multipleValidations(objectToValidate) {
	// Check that there are key/value pairs to validate
    console.log('multiplevalidator',objectToValidate);
	if (Object.keys(objectToValidate).length === 0) {
		return { success: false, result: 'No key/value pairs to validate' };
    }

	let validationResult;

    // Each of the key/value pairs is validated
    console.log('objectToValidate', objectToValidate);
	for (var key in objectToValidate) {

		console.log('key to validate:', key);
		let value = objectToValidate[key];

		// if ((key === 'businessImages') || (key !== 'businessImages' && value)) {
		if (value) {
			// console.log('Value associated with the key ' + key + ' is:', value);

			switch (key) {
				case 'email':
				case 'userEmail':
					validationResult = emailIsValid(key, value);
					break;
				case 'password':
					validationResult = passwordIsValid(value);
					if (!validationResult.success) {
						validationResult.result = 'Password must be at least 8 characters';
					}
					break;
				case 'name':
				case 'businessName':
					validationResult = nameIsValid(key, value);
					break;
				case 'url':
					validationResult = urlIsValid(value);
					break;
				case 'image':
					validationResult = acceptedExtensionForImageFile(value);
					break;
				case 'imageType':
					validationResult = acceptedImageTypeForImageFile(value);
					break;
				default:
					validationResult = { success: false, result: key + 'I don\'t know to validate the ' + key + ' key' };
					break;
			}

			if (!validationResult.success) {
				return validationResult;
			}
		} else {
			return { success: false, result: 'No value associated with the ' + key + ' key' };
		}
	}

	return { success: true, result: 'Successful validations' };
}

module.exports = {
	// getSecretKey,
	// idBusinessTypeIsValid,
	// idCmsTypeIsValid,
	// userIsValid,
	// businessCanBeCreated,
	multipleValidations
}