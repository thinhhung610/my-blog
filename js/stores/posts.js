"use strict";

import Reflux from 'reflux';
import Actions from 'appRoot/actions';
import Request from 'superagent';
import Config from 'appRoot/appConfig';

export default Reflux.createStore({
  listenables: Actions,
  endpoint: Config.apiRoot + '/posts',
  /*
  posts: [],
  // called when mixin is used to init the component state
  getInitialState: function() {
    return this.posts;
  },
  init: function() {
    Request.get(this.endpoint).end(function(err, res) {
      if(res.ok) {
        this.posts = res.body;
        this.trigger(this.posts);
      } else {
        console.log(err);
      }
    }.bind(this));
  },
  */
  // posts, init, getInitialState are removed.
  // getPostsByPage handles list requests
  getPostsByPage: function(page = 1, params) {
    var start = Config.pageSize * (page - 1),
        end = start + Config.pageSize,
        query = {
          '_sort' : 'date',
          '_order' : 'DESC',
          '_start' : start,
          '_end' : end
        },
        that = this;

    if(typeof params === 'object') {
      // ES6 extend object
      Object.assign(query, params);
    }

    if(this.currentRequest) {
      this.currentRequest.abort();
      this.currentRequest = null;
    }

    return new Promise(function(resolve, reject) {
      that.currentRequest = Request.get(that.endpoint);
      that.currentRequest.query(query).end(function(err, res) {
        var results = res.body;

        function complete() {
          resolve({
            start: query._start,
            end: query._end,
            results: results
          });
        }

        if(res.ok) {
          Config.loadTimeSimMs ? setTimeout(complete, Config.loadTimeSimMs) : complete();
        } else {
          reject(Error(err));
        }
        this.currentRequest = null;
      }.bind(that));
    });
  },
  onGetPost: function(id) {
    function req() {
      Request.get(this.endpoint).query({id: id}).end(function(err, res) {
        if(res.ok) {
          if(res.body.length > 0) {
            Actions.getPost.completed(res.body[0]);
          } else {
            Actions.getPost.failed('Post (' + id + ') not found');
          }
        } else {
          Actions.getPost.failed(err);
        }
      });
    }
    Config.loadTimeSimMs ? setTimeout(req.bind(this), Config.loadTimeSimMs) : req();
  },
  onModifyPost: function(post, id) {
    function req() {
      Request[id ? 'put' : 'post'](id ? this.endpoint + '/' + id : this.endpoint).send(post).end(function(err, res) {
        if(res.ok) {
          Actions.modifyPost.completed(res);
          // if there's already a post in our local store we need to modify it
          // if not, add this one
          var existingPostIdx = Array.findIndex(this.posts, function(post) {
            return res.body.id == post.id;
          });
          if (existingPostIdx > -1) {
            this.posts[existingPostIdx] = res.body;
          } else {
            this.posts.push(res.body);
          }
        } else {
          // Actions.modifyPost.completed();
          Actions.modifyPost.failed('Cannot create this post.');
        }
      }.bind(this));
    }
    Config.loadTimeSimMs ? setTimeout(req.bind(this), Config.loadTimeSimMs) : req();
  },
  onRemovePost: function(id) {
    function req() {
      Request.del(this.endpoint + '/' + id).end(function(err, res) {
        if(res.ok) {
          Actions.removePost.completed(res);
        } else {
          Actions.removePost.failed(err);
        }
      });
    }
    Config.loadTimeSimMs ? setTimeout(req.bind(this), Config.loadTimeSimMs) : req();
  }
});
