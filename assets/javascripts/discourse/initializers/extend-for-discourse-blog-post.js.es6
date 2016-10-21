import {withPluginApi} from 'discourse/lib/plugin-api';
import ComposerController from 'discourse/controllers/composer';

function initializeWithApi(api) {

}

export default {
  name: 'extend-for-discourse-blog-post',
  initialize() {

    ComposerController.reopen({
      showBlogPostControls: function () {
        var model = this.get('model');
        if (!model) {
          return false;
        }
        var category = this.site.categories.findProperty('id', model.get('categoryId'));

        return category.get('blog_posts_enabled');
      }.property('model.categoryId'),
      actions: {
        save() {

          this.get('showBlogPostControls');
          this._super();
        }

      }

    });

    withPluginApi('0.1', initializeWithApi);
  }
};