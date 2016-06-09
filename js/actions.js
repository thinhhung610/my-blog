"use strict";

import Reflux from 'reflux';

var Actions = Reflux.createActions({
	'getPost': {
		asyncResult: true,
		children: ['completed', 'failed']
	},
	'modifyPost': {
		asyncResult: true
	},
	'login': {
		asyncResult: true,
		children: ['completed', 'failed']
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
