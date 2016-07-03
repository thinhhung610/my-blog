"use strict";

import React             from 'react';
import Reflux            from 'reflux';
import { Link, hashHistory } from 'react-router';
import Actions           from 'appRoot/actions';
import SessionStore      from 'appRoot/stores/sessionContext';

export default React.createClass({
	mixins: [
		Reflux.connect(SessionStore, 'session'),
		// History
	],
	getInitialState: function() {
		return {
			searchTimeout : null
		}
	},
	logOut: function () {
		Actions.logOut();
		// this.history.pushState('', '/');
    hashHistory.push('/login');
	},
	search: function() {
		var sVal = this.refs.search.value;
		clearTimeout(this.state.searchTimeout);
		this.state.searchTimeout = setTimeout(function() {
			Actions.search(sVal);
		}, 500);
	},
	render: function () {
		return (
			<header className="app-header">
				<Link to="/"><h1>Re&#923;ction</h1></Link>
				<section className="account-ctrl">
					<input ref="search" type="search" placeholder="search" defaultValue={this.state.initialQuery} onChange={this.search} />
					{
						this.state.session.loggedIn ?
							(<Link to="/posts/create">
								Hello {this.state.session.username}, write something!
							</Link>) :
							<Link to="/users/create">Join</Link>
					}
					{
						this.state.session.loggedIn ?
							<a onClick={this.logOut}>Log Out</a> :
							<Link to="/login">Log In</Link>
					}
				</section>
			</header>
		);
	}
});
