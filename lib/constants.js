"use strict"

// Array of Busines type objects
const businessTypes = [
	{ idBusinessType: 0, literal: 'BLOG' },
	{ idBusinessType: 1, literal: 'ECOMMERCE' },
	{ idBusinessType: 2, literal: 'BLOG+ECOMMERCE' },
	{ idBusinessType: 3, literal: 'ADMINISTRATION' }
];

const imageExtensionsAccepted = [
	'jpg',
	'png'
];

const imageTypesAccepted = [
	'logo',
	'welcomeImage'
];

module.exports = {
	businessTypes,
	imageExtensionsAccepted,
	imageTypesAccepted
}