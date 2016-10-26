import {on} from 'ember-addons/ember-computed-decorators'
import Scrolling from 'discourse/mixins/scrolling';

export default Ember.Component.extend(Scrolling, {
  tagName: 'div',
  classNames: 'discourse-blog-post-header',

  @on('didInsertElement')
  addBodyClass() {
    $('body').addClass('blog-post blog-post-docked');
    if (Discourse.SiteSettings.blog_post_use_default_styles) {
      $('body').addClass('use-blog-post-styles');
    }
    this.bindScrolling({name: 'blog-post-header'});
  },

  @on('willDestroyElement')
  removeBodyClass() {
    $('body').removeClass('blog-post');
  },

  scrolled() {
    $('body').removeClass('blog-post-docked');
    this.unbindScrolling('blog-post-header');
  }
});