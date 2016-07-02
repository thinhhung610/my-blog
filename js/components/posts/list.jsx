"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import Config from 'appRoot/appConfig';
// import Reflux from 'reflux';
import PostStore from 'appRoot/stores/posts';
import PostView from 'appRoot/views/posts/view';
import Loader from 'appRoot/components/loader';

export default React.createClass({
  // mixins: [
  //   Reflux.connect(PostStore, 'posts')
  // ],
  getInitialState: function() {
    return {
      page: 1,
      posts: []
    };
  },
  componentWillMount: function() {
    this.getNextPage();
  },
  componentDidMount: function() {
    var el = ReactDOM.findDOMNode(this).parentNode,
        style;

    while(el) {
      style = window.getComputedStyle(el);

      if(style.overflow.length || style.overflowY.length || /body/i.test(el.nodeName)) {
        this.scrollParent = el;
        break;
      } else {
        el = el.parentNode;
      }
    }

    this.scrollParent.addEventListener('scroll', this.onScroll);
  },
  componentWillUnmount: function() {
    this.scrollParent.removeEventListener('scroll', this.onScroll);
  },
  onScroll: function(e) {
    var scrollEl = this.scrollParent,
        scrollDiff = Math.abs(scrollEl.scrollHeight - (scrollEl.scrollTop + scrollEl.clientHeight));

    if(!this.state.loading && !this.state.hitmax && scrollDiff < 100) {
      this.getNextPage();
    }
  },
  getNextPage: function() {
    this.setState({
      loading: true
    });

    PostStore.getPostsByPage(this.state.page, this.props).then(function(results) {
      var data = results.results;

      Array.prototype.splice.apply(this.state.posts, [results.start, results.end].concat(data));

      if(this.isMounted()) {
        this.setState({
          loading: false,
          hitmax: data.length === 0 || data.length < Config.pageSize,
          page: this.state.page + 1
        });
      }
    }.bind(this), function(err) {
      console.log(err);
    });
  },
  render: function () {
    // var posts = this.props.user ? this.state.posts.filter(function(post) { return post.user == this.props.user; }.bind(this))
    //                             : this.state.posts;
    var posts = this.state.posts;
    var postsUI = posts.map(function (post) {
        return <PostView key={post.id} post={post} mode="summary"/>;
    });

    return (
      <div className="post-list">
        <ul>
          {postsUI}
        </ul>
        {this.state.hitmax && !this.state.loading ? (
          <div className="total-posts-msg">
            showing {this.state.posts.length} posts
          </div>
        ) : ''}
        {this.state.loading ? <Loader inline="{true}"/> : ''}
      </div>
    );
  }
});
