import { on } from 'ember-addons/ember-computed-decorators'

export default Ember.Component.extend({
  tagName: 'div',
  classNames: 'discourse-blog-post-header',

  @on('didInsertElement')
    addBodyClass() {
    $('body').addClass('blog-post');
  },

  @on('willDestroyElement')
    removeBodyClass() {
    $('body').removeClass('blog-post');
  }
});