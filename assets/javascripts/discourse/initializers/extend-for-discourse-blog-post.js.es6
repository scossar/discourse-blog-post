import {withPluginApi} from 'discourse/lib/plugin-api';
import {ajax} from 'discourse/lib/ajax';
import {popupAjaxError} from 'discourse/lib/ajax-error';
import TopicController from 'discourse/controllers/topic';
import TopicStatus from 'discourse/views/topic-status';

function markAsBlogPost(post) {
  const topic = post.topic;

  post.set('is_blog_post', true);
  topic.set('has_blog_post', true);

  ajax('/blog/mark_as_blog_post', {
    type: 'POST',
    data: {id: post.id}
  }).catch(popupAjaxError);
}

function unmarkAsBlogPost(post) {
  const topic = post.topic;

  post.set('is_blog_post', false);
  topic.set('has_blog_post', false);

  ajax('/blog/unmark_as_blog_post', {
    type: 'POST',
    data: {id: post.id}
  }).catch(popupAjaxError);
}

function addBlogImageClass($elem, helper) {
  if (helper) {
    const post = helper.getModel();
    const isBlogPost = post.get('is_blog_post');
    const imageUrl = post.get('image_url');

    if (isBlogPost && imageUrl) {
      $elem.find('img').first().addClass('blog-post-image');
      $elem.addClass('blog-post-content');
    } else if (isBlogPost) {
      $elem.addClass('blog-post-content');
    }
  }
}

function initializeWithApi(api) {
  api.includePostAttributes('is_blog_post', 'can_create_blog_post', 'allow_blog_posts_in_category', 'image_url');

  api.addPostMenuButton('blogPost', attrs => {

    if (attrs.firstPost && attrs.can_create_blog_post && attrs.allow_blog_posts_in_category) {
      if (attrs.is_blog_post) {

        return {
          action: 'unmarkAsBlogPost',
          icon: 'book',
          className: 'blog-post-icon',
          title: 'blog_post.convert_to_regular_post',
          label: 'blog_post.convert_to_regular_post',
          position: 'second-last-hidden'
        }
      } else {

        return {
          action: 'markAsBlogPost',
          icon: 'book',
          className: 'not-blog-post-icon',
          title: 'blog_post.convert_to_blog_post',
          label: 'blog_post.convert_to_blog_post',
          position: 'second-last-hidden'
        }
      }
    }
  });

  api.attachWidgetAction('post', 'markAsBlogPost', function () {
    const post = this.model;
    const current = post.get('topic.postStream.posts');

    markAsBlogPost(post);

    current.forEach(p => this.appEvents.trigger('post-stream:refresh', {id: p.id}));
    Em.$('body').addClass('blog-post');
  });

  api.attachWidgetAction('post', 'unmarkAsBlogPost', function () {
    const post = this.model;
    const current = post.get('topic.postStream.posts');

    unmarkAsBlogPost(post);

    current.forEach(p => this.appEvents.trigger('post-stream:refresh', {id: p.id}));
    Em.$('body').removeClass('blog-post');
  });

  api.decorateCooked(addBlogImageClass);
}

export default {
  name: 'extend-for-discourse-blog-post',
  initialize() {

    TopicController.reopen({
      headerImageSrc: function () {
        return this.get('model.image_url');
      }.property('model.image_url'),

      hasBlogPost: Ember.computed.alias('model.has_blog_post')
    });

    TopicStatus.reopen({
      statuses: function () {
        const results = this._super();
        if (this.topic.has_blog_post) {
          results.push({
            openTag: 'span',
            closeTag: 'span',
            title: I18n.t('blog_post.has_blog_post'),
            icon: 'book',
          });
        }
        return results;
      }.property()
    });

    withPluginApi('0.1', initializeWithApi);
  }
};