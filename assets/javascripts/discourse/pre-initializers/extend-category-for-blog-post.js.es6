import property from 'ember-addons/ember-computed-decorators';
import Category from 'discourse/models/category';

export default {
  name: 'extend-category-for-blog-post',
  before: 'inject-discourse-objects',

  initialize(){

    Category.reopen({
      @property('custom_fields.enable_blog_posts')
      enable_blog_posts: {
        get(enabledField) {
          return enabledField === 'true'
        },
        set(value) {
          value = value ? 'true' : 'false';
          this.set('custom_fields.enable_blog_posts', value);
          return value;
        }
      }
    });
  }
};