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
	onGetPostCompleted: function(res) {
		// console.log(res);
		this.state.post = res;
		this.state.loading = false;
    this.trigger(this.state);
	},
	onGetPostFailed: function(msg) {
		this.state.post = null;
		this.state.loading = false;
		this.state.err = msg;
    this.trigger(this.state);
	},
	onModifyPostCompleted: function(res) {
		// console.log(res);
		this.state.post = res.body;
		this.state.loading = false;
    this.trigger(this.state);
	},
	onModifyPostFailed: function(msg) {
		// console.log(msg);
		this.state.post = null;
		this.state.loading = false;
		this.state.err = msg;
    this.trigger(this.state);
	},
	onRemovePostCompleted: function(res) {
		console.log(res);
		this.state.loading = false;
		this.trigger(this.state);
	},
	onRemovePostFailed: function(res) {
		console.log(res);
		this.state.loading = false;
		this.state.err = res;
		this.trigger(this.state);
	},
});

export default ActionStore;
