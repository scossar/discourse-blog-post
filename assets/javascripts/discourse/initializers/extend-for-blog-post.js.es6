import PostView from 'discourse/views/post';
import TopicView from 'discourse/views/topic';
import TopicController from 'discourse/controllers/topic';

export default {
  name: 'extend-for-blog-post',

  initialize() {

    TopicController.reopen({

      blogCategory: function () {
        return this.siteSettings.blog_post_category;
      }.property(),

      // Can the input be validated somewhere first?
      blogCategoryClass: function () {
        return this.get('blogCategory').replace(/ /g, '-');
      }.property('blogCategory'),

      isBlog: function () {
        const currentCategory = this.get('model.category.fullSlug');
        return this.get('blogCategoryClass') === currentCategory;
      }.property('model.category.fullSlug'),

      postDate: function () {
        return new Date(this.get('model.created_at')).toLocaleDateString();
      }.property('model.created_at'),

      postedBy: function () {
        const poster = this.get('model.details.created_by.username');
        if (!poster) {
          return;
        }
        return poster;
      }.property('model.details.created_by.username'),

      cooked: function () {
        const posts = this.get('model.postStream.posts');
        if (!posts) {
          return;
        }
        return posts[0].get('cooked');
      }.property('model.postStream.posts'),

      bgImages: function () {
        const cooked = this.get('cooked');
        if (!cooked) {
          return;
        }
        let $cooked = $($.parseHTML(cooked));
        return $cooked.find('.header-image');
      }.property('cooked'),

      hasBgImg: function () {
        const bgImages = this.get('bgImages');
        return bgImages.length;
      }.property('bgImages'),

    });

    TopicView.reopen({
      isBlog: Em.computed.alias('controller.isBlog'),

      addBlogBodyClass: function () {
        if (this.get('isBlog')) {
          $('body').addClass('blog-post');
        }
      }.on('didInsertElement'),

      removeBlogBodyClass: function () {
        $('body').removeClass('blog-post');
      }.on('willDestroyElement'),

    });

    PostView.reopen({
      isBlog: Em.computed.alias('controller.isBlog'),
      bgImages: Em.computed.alias('controller.bgImages'),

      _addBlogBodyClass: function () {
        if (this.get('isBlog')) {
          $('body').addClass('blog-post');
        }
      },

      _resizeBackground: function (event) {
        let imgWidth = $('#main-outlet').width(),
          newHeight = (event.data.bgMaxHeight < imgWidth * event.data.bgRatio) ? event.data.bgMaxHeight : imgWidth * event.data.bgRatio;

        $('.bg-container').css('height', newHeight + 'px');
        $('.large-title').css('padding-top', newHeight + 'px');
      },

      _adjustForResize: function (maxHeight, imgRatio) {
        $(window).on('resize', {
          bgMaxHeight: maxHeight,
          bgRatio: imgRatio
        }, this._resizeBackground);
      },


      didInsertElement: function () {
        this._addBlogBodyClass();
        let bgImages = this.get('bgImages');
        if (bgImages) {
          let $firstImage = $(bgImages[0]),
            imageUrl = $firstImage.attr('src'),
            imageWidth = $firstImage.attr('width'),
            imageHeight = $firstImage.attr('height'),
            imageRatio = imageHeight / imageWidth,
            imageMaxHeight = $firstImage.data('max-height') || 472,
            windowWidth = $('#main-outlet').width(),
            imageComputedHeight = imageMaxHeight < windowWidth * imageRatio ? imageMaxHeight : windowWidth * imageRatio;

          $('.bg-container').css({
            'height': imageComputedHeight + 'px',
            'background-image': 'url(' + imageUrl + ')',
            'background-repeat': 'no-repeat',
            'background-size': '100% auto',
          });

          $('.large-title').css({
            'visibility': 'visible',
            'padding-top': imageComputedHeight + 'px'
          });

          this._adjustForResize(imageMaxHeight, imageRatio);
        }
      },

      removeBlog: function () {
        $('body').removeClass('blog-post');
        $('.large-title').css({
          'visibility': 'hidden',
          'padding-top': 0
        });
        $('.bg-container').css({
          'height': 0,
          'background': 'none',
        });
      }.on('willDestroyElement'),
    });
  }
}
