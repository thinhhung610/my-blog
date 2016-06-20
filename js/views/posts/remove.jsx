"use strict";

import React from 'react';
import Reflux from 'reflux';
import Actions from 'appRoot/actions';
import ActionStore from 'appRoot/actionStore';
import Loader from 'appRoot/components/loader';
import { browserHistory } from 'react-router';

export default React.createClass({
  mixins: [
		Reflux.connect(ActionStore, 'actionStore')
	],
  getInitialState: function() {
		return {};
	},
  componentWillMount: function() {
		this.removePost();
	},
	componentWillUnmount: function() {
		// unregister ActionStore
		this.unsubscribe && this.unsubscribe();
	},
  componentDidMount: function() {

  },
  removePost: function() {
    if(this.unsubscribe) {
			this.setState({loading: true});
		} else {
			this.state.loading = true;
		}

    Actions.removePost(this.props.params.postId);

    this.unsubscribe = ActionStore.listen(function(data) {
			if(data.err) {
				this.setState({ loading: data.loading, msg: data.err });
			} else {
				this.setState({ loading: data.loading, msg: 'Your post has been removed successfully!!!' });
			}
      window.setTimeout(function() {
        // browserHistory.push({}, '', '/');
        window.location.href = '/';
      }, 2000);
		}.bind(this));
  },
	render: function () {
    if (this.state.loading) {
      return <Loader />;
    }

		return (
			<div>{this.state.msg}</div>
		);
	}
});
