"use strict";

import Reflux from 'reflux';
import Actions from 'appRoot/actions';
import { hashHistory } from 'react-router';

var ActionStore = Reflux.createStore({
	listenables: Actions,
	init: function() {
    this.state = {};
  },
	getInitialState: function() {
		return this.state;
	},
	onLogin: function() {
		console.log('Login...');
	},
	onLoginCompleted: function() {
		this.state.isLogged = true;
		this.trigger(this.state);
		hashHistory.push('/');
	},
	onLoginFailed: function() {
		this.state.isLogged = false;
		this.trigger(this.state);
	},
	onGetPostCompleted: function(result) {
		// console.log(result);
		this.state.post = result;
		this.state.loading = false;
    this.trigger(this.state);
	},
	onGetPostFailed: function(msg) {
		this.state.post = null;
		this.state.loading = false;
		this.state.err = msg;
    this.trigger(this.state);
	}
});

export default ActionStore;
