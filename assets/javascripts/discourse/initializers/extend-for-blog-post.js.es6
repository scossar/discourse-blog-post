import TopicView from 'discourse/views/topic';
import CloakedView from 'discourse/views/cloaked';
import TopicModel from 'discourse/models/topic';
import ComposerView from 'discourse/views/composer';
import ApplicationView from 'discourse/views/application';

function generateHeaderImage() {
  var $firstPost = $('#post-cloak-1'),
    $firstP = $firstPost.find('.cooked p').first(),
    bgURL = $firstP.find('img').attr('src'),
    $mainOutlet = $('#main-outlet'),
    topicTitle = $('.fancy-title').html(),
    $largeTitle = $('<div class="large-title-container"><h1>' + topicTitle + '</h1></div>'),
    headerImgHeight = 472;

  // #topic-title is being hidden with css. .large-title-container is used instead.
  $('.container.posts').prepend($largeTitle);

  // If there is an image in the first paragraph:
  if (bgURL) {
    if (!$mainOutlet.find('.bg-container').length) {
      $mainOutlet.prepend('<div class="bg-container"></div>');
    }

    // Remove the image p so it doesn't display twice
    $firstP.remove();

    $('.bg-container').css({
      'height': headerImgHeight + 'px',
      'background-image': 'url(' + bgURL + ')',
      'background-repeat': 'no-repeat',
      'background-size': '100% auto', // + windowHeight + 'px',
    });

    $('.large-title-container').css({
      'padding-top': headerImgHeight + 'px',
    });
  }
}

function destroyBlog() {
  if ($('body').hasClass('blog-post')) {
    $('body').removeClass('blog-post');
    $('.bg-container').remove();
    $('.large-title-container').remove();
  }
}

export default {
  name: 'extend-for-blog-post',

  initialize() {

    // Create a typical 'posted at' date - this needs to be improved
    TopicModel.reopen({
      humanDate: function() {
        let postDate = new Date(this.get('created_at')).toLocaleDateString();
        return 'Posted&nbsp;on:&nbsp;' + postDate;
      }.property('created_at'),
    });

    TopicView.reopen({
      humanDate: Em.computed.alias('controller.model.humanDate'),

      didInsertElement: function () {
        this._super();
        let blogCategory = this.siteSettings.blog_post_category,
          categoryFullSlug = this.get('categoryFullSlug');

        if (blogCategory === categoryFullSlug) {
          $('body').addClass('blog-post');
          generateHeaderImage();
          $('.topic-meta-data').append('<div class="posted-at">' + this.get('humanDate') + '</div>');
        }
      },

      topicChanged: function () {
        let blogCategory = this.siteSettings.blog_post_category,
          categoryFullSlug = this.get('categoryFullSlug');

        if (blogCategory === categoryFullSlug) {
          $('body').addClass('blog-post');
          generateHeaderImage();
          $('.topic-meta-data').append('<div class="posted-at">' + this.get('humanDate') + '</div>');
        }
      }.observes('controller.model', 'controller.currentPath'),

    });

    CloakedView.reopen({
      humanDate: Em.computed.alias('controller.model.humanDate'),

      didInsertElement: function () {
        this._super();
        let blogCategory = this.siteSettings.blog_post_category,
          categoryFullSlug = 'category-' + blogCategory;
        if ($('body').hasClass(categoryFullSlug)) {
          $('body').addClass('blog-post');
          generateHeaderImage();
          $('.topic-meta-data').append('<div class="posted-at">' + this.get('humanDate') + '</div>');
        } else {
          destroyBlog();
        }
      },

      willDestroyElement: function () {
        destroyBlog();
      }
    });
  }
}

