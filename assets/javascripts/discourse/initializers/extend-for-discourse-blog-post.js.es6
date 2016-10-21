import { withPluginApi } from 'discourse/lib/plugin-api';
import { ajax } from 'discourse/lib/ajax';
import { popupAjaxError } from 'discourse/lib/ajax-error';

function markAsBlogPost(post) {
  const topic = post.topic;

  post.set('is_blog_post', true);
  topic.set('has_blog_post', true);

  ajax('/blog/mark_as_blog_post', {
    type: 'POST',
    data: { id: post.id }
  }).catch(function(error){
    popupAjaxError(error);
  });
}

function unmarkAsBlogPost(post) {
  const topic = post.topic;

  post.set('is_blog_post', false);
  topic.set('has_blog_post', false);

  ajax('/blog/unmark_as_blog_post', {
    type: 'POST',
    data: { id: post.id }
  }).catch(function(error){
    popupAjaxError(error);
  });
}



function initializeWithApi(api) {
  api.includePostAttributes('is_blog_post');

  api.addPostMenuButton('blogPost', attrs => {

    if (attrs.firstPost) {
      if (attrs.is_blog_post) {
        return {
          action: 'unmarkAsBlogPost',
          icon: 'pencil-square',
          className: 'blog-post-icon',
          title: 'blog_post.convert_to_regular_post',
          label: 'blog_post.convert_to_regular_post',
          position: 'first'
        }
      } else {
        return {
          action: 'markAsBlogPost',
          icon: 'pencil-square-o',
          className: 'not-blog-post-icon',
          title: 'blog_post.convert_to_blog_post',
          label: 'blog_post.convert_to_blog_post',
          position: 'first'
        }
      }
    }
  });

  api.attachWidgetAction('post', 'markAsBlogPost', function() {
    const post = this.model;
    const current = post.get('topic.postStream.posts');

    markAsBlogPost(post);

    current.forEach(p => this.appEvents.trigger('post-stream:refresh', { id: p.id }));
  });

  api.attachWidgetAction('post', 'unmarkAsBlogPost', function() {
    const post = this.model;
    const current = post.get('topic.postStream.posts');

    unmarkAsBlogPost(post);

    current.forEach(p => this.appEvents.trigger('post-stream:refresh', { id: p.id }));
  });


}

export default {
  name: 'extend-for-discourse-blog-post',
  initialize() {


    withPluginApi('0.1', initializeWithApi);
  }
};