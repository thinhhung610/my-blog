"use strict";

import Reflux from 'reflux';
import { hashHistory } from 'react-router';

var Actions = Reflux.createActions({
	'getPost': {
		asyncResult: true
	},
	'modifyPost': {
		asyncResult: true
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

Reflux.createStore({
	listenables: Actions,
	onLogin: function() {
		console.log('on login');
	},
	onLoginCompleted: function() {
		console.log("SUCCESS");
		hashHistory.push('/');
	},
	onLoginFailed: function() {
		console.log("ERROR");
	}
});

export default Actions;
