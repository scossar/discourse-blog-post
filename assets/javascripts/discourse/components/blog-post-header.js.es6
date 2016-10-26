import {on} from 'ember-addons/ember-computed-decorators'
import Scrolling from 'discourse/mixins/scrolling';

export default Ember.Component.extend(Scrolling, {
  tagName: 'div',
  classNames: 'discourse-blog-post-header',

  @on('didInsertElement', 'didReceiveAttrs')
  addBodyClass() {
    let bodyClasses = Discourse.SiteSettings.blog_post_use_default_styles ? 'blog-post blog-post-docked use-blog-post-styles' : 'blog-post blog-post-docked';
    $('body').addClass(bodyClasses);

    this.bindScrolling({name: 'blog-post-header'});
  },

  @on('willDestroyElement')
  removeBodyClass() {
    $('body').removeClass('blog-post use-blog-post-styles blog-post-docked');
  },

  scrolled() {
    $('body').removeClass('blog-post-docked');
    this.unbindScrolling('blog-post-header');
  }
});