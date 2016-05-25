"use strict";

import Reflux from 'reflux';
import { browserHistory } from 'react-router';

var Actions = Reflux.createActions({
	'getPost': {
		asyncResult: true
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

Reflux.createStore({
	listenables: Actions,
	onLogin: function() {
		console.log(123);
	},
	onLoginCompleted: function() {
		console.log("SUCCESS", arguments);
		browserHistory.push('/');
	},
	onLoginFailed: function() {
		console.log("ERROR", arguments);
	}
});

export default Actions;
