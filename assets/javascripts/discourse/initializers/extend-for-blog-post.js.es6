import PostView from 'discourse/views/post'
import TopicController from 'discourse/controllers/topic';

// This shoud be a mixin

function resizeBackground(event) {
  var imgWidth = $('#main-outlet').width(),
    newHeight = (event.data.bgMaxHeight < imgWidth * event.data.bgRatio) ? event.data.bgMaxHeight : imgWidth * event.data.bgRatio;

  $('.bg-container').css('height', newHeight + 'px');
  $('.large-title').css('padding-top', newHeight + 'px');
}

function adjustForResize(maxHeight, imgRatio) {
  $(window).on('resize', {
    bgMaxHeight: maxHeight,
    bgRatio: imgRatio
  }, resizeBackground);
}


export default {
  name: 'extend-for-blog-post',

  initialize() {

    TopicController.reopen({

      blogCategory: function () {
        return this.siteSettings.blog_post_category;
      }.property(),

      blogCategoryClass: function () {
        return this.get('blogCategory').replace(/ /g, '-');
      }.property('blogCategory'),

      isBlog: function () {
        const currentCategory = this.get('model.category.fullSlug');
        return this.get('blogCategoryClass') === currentCategory;
      }.property('model.category.fullSlug'),

      topicTitle: function () {
        const topicTitle = this.get('model.fancy_title');
        if (!topicTitle) { return; }
        return topicTitle;
      }.property('model.fancy_title'),

      postDate: function () {
        return new Date(this.get('model.created_at')).toLocaleDateString();
      }.property('model.created_at'),

      postedBy: function () {
        const poster = this.get('model.details.created_by.username');
        if (!poster) { return; }
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

    PostView.reopen({
      //firstPoster: Em.computed('controller.firstPoster'),
      blogCategory: Em.computed.alias('controller.blogCategory'),
      blogCategoryClass: Em.computed.alias('controller.blogCategoryClass'),
      isBlog: Em.computed.alias('controller.isBlog'),
      hasBgImg: Em.computed.alias('controller.hasBgImg'),
      postDate: Em.computed.alias('controller.postDate'),
      firstPoster: Em.computed.alias('controller.firstPoster'),
      cooked: Em.computed.alias('controller.cooked'),
      bgImages: Em.computed.alias('controller.bgImages'),

      _addBlogBodyClass: function () {
        if (this.get('isBlog')) {
          $('body').addClass('blog-post');
        }
      },

      didInsertElement: function () {
        console.log("POST VIEW")
        this._addBlogBodyClass();
        let bgImages = this.get('bgImages');
        if (bgImages) {
          let $firstImage = $(bgImages[0]),
            imageUrl = $firstImage.attr('src'),
            imageWidth = $firstImage.attr('width'),
            imageHeight = $firstImage.attr('height'),
            imageRatio = imageHeight / imageWidth,
            imageMaxHeight = 472,
            imageComputedHeight = imageMaxHeight < imageWidth * imageRatio ? imageMaxHeight : imageWidth * imageRatio;

          $('.bg-container').css({
            'height': imageComputedHeight + 'px',
            'background-image': 'url(' + imageUrl + ')',
            'background-repeat': 'no-repeat',
            'background-size': '100% auto'
          });

          $('.large-title').css({
            'padding-top': imageComputedHeight + 'px'
          });

          adjustForResize(imageMaxHeight, imageRatio);
        }
      },

      removeBlogBodyClass: function () {
        if (this.get('isBlog')) {
          $('body').removeClass('blog-post');
        }
      }.on('willDestroyElement'),
    });
  }
}
