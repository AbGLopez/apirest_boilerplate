"use strict";

const mongoose = require('mongoose');

// Schema definition
const userSchema = mongoose.Schema({
	email: String,
	name: String,
	password: String,
	creationDate: Date,
	lastDeletedDate: Date,
	lastModifiedDate: Date,
	lastReactivatedDate: Date,
	isActive: Boolean
});

userSchema.index({email: 1});

// Static methods
userSchema.statics.list = function(filter, limit, skip, fields, sort, callback) {
	const query = User.find(filter);
	query.limit(limit);
	query.skip(skip);
	query.select(fields); // {nombredecampo: 1, campoquenoquiero: 0}
	query.sort(sort);
	query.exec(callback);
};

// Create the model
var User = mongoose.model('User', userSchema);

// It's not necessary import it. We can use mongoose.model('User')
module.exports = User;