"use strict";

import Reflux from 'reflux';

var Actions = Reflux.createActions({
	'getPost': {
		asyncResult: true,
		children: ['completed', 'failed']
	},
	'modifyPost': {
		asyncResult: true,
		children: ['completed', 'failed']
	},
	'removePost': {
		asyncResult: true,
		children: ['completed', 'failed']
	},
	'login': {
		asyncResult: true,
		children: ['completed', 'failed', 'isLogged']
	},
	'logOut': {},
	'createUser': {
		asyncResult: true
	},
	'editUser': {
		asyncResult: true
	},
	'search': {},
	'getSessionContext': {}
});

export default Actions;
