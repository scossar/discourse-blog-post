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
    console.log('attrs', attrs);

    if (attrs.firstPost) {
      if (attrs.is_blog_post) {
        return {
          icon: 'star',
          className: 'blog-post-icon',
          title: 'blog_post.convert_to_regular_post',
          position: 'first'
        }
      } else {
        return {
          icon: 'star',
          className: 'not-blog-post-icon',
          title: 'blog_post.convert_to_blog_post',
          position: 'first'
        }
      }
    }
  });

}

export default {
  name: 'extend-for-discourse-blog-post',
  initialize() {


    withPluginApi('0.1', initializeWithApi);
  }
};