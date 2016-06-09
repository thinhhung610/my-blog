"use strict";

import React from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router';
import ClassNames from 'classnames';
import Moment from 'moment';
import Actions from 'appRoot/actions';
import ActionStore from 'appRoot/actionStore';
import PostStore from 'appRoot/stores/posts';
import UserStore from 'appRoot/stores/users';
import Session from 'appRoot/stores/sessionContext';
import Loader from 'appRoot/components/loader';

let dateFormat = 'MM/DD/YYYY HH:mm:ss';

export default React.createClass({
	mixins: [
		Reflux.connect(Session, 'session'),
		Reflux.connect(UserStore, 'users'),
		Reflux.connect(ActionStore, 'actionStore')
	],
	getInitialState: function() {
		return {
			post : this.props.post
		}
	},
	componentWillMount: function() {
		if(!this.state.post) {
			// get post from query params
			this.getPost();
		}
	},
	componentWillUnmount: function() {
		// unregister ActionStore
		this.unsubscribe && this.unsubscribe();
	},
	getUserFromPost: function (post) {
		return Array.find(this.state.users, function (user) {
			return user.id === post.user;
		});
	},
	getPost: function () {
		if(this.unsubscribe) {
			this.setState({loading: true});
		} else {
			this.state.loading = true;
		}

		/*
		Actions.getPost(this.props.params.postId).then(function (data) {
			//this.state.posts = this.state.posts.concat(data);
			this.setState({
				loading: false,
				post: data
			});
		}.bind(this));
		*/

		Actions.getPost(this.props.params.postId);
		this.unsubscribe = ActionStore.listen(function(data) {
			if(data.err) {
				this.setState({ error: data.err, loading: data.loading });
			} else {
				this.setState({
					loading: false,
					post: data.post
				});
			}
		}.bind(this));
	},
	render: function () {
		if (this.state.loading) {
			return <Loader />;
		}

		var post = this.state.post,
				user = this.getUserFromPost(post),
				name = user.firstName && user.lastName ? (user.firstName + ' ' + user.lastName) : (user.firstName ? user.firstName : user.username);

		return this.props.mode === 'summary' ? (
			<li className="post-view-summary">
			<aside>
				<img className="profile-img small" src={user.profileImageData} />
				<div className="post-metadata">
					<strong>{post.title}</strong>
					<span className="user-name">{name}</span>
					<em>{Moment(post.date, 'x').format(dateFormat)}</em>
				</div>
			</aside>
			<summary>{post.summary}</summary>
			&nbsp;
			<Link to={`/posts/${post.id}`}>read more</Link>
			{
				user.id === this.state.session.id ? (
				<div>
					<Link to={`/posts/${post.id}/edit`}>
						<button>edit post</button>
					</Link>
				</div>
				) : ''
			}
			</li>
		) : (
			// FULL POST VIEW
			<div className="post-view-full">
				<div className="post-view-container">
					<h2>
						<img className="profile-img" src={user.profileImageData}/>
						<div className="post-metadata">
							<strong>{post.title}</strong>
							<span className="user-name">{name}</span>
							<em>{Moment(post.date, 'x').format(dateFormat)}</em>
						</div>
					</h2>
					<section className="post-body" dangerouslySetInnerHTML={{__html: post.body}}></section>
				</div>
			</div>
		);
	}
});
