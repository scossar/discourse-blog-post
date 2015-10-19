import TopicView from 'discourse/views/topic';
import CloakedView from 'discourse/views/cloaked';
import TopicModel from 'discourse/models/topic';
import ComposerView from 'discourse/views/composer';
import ApplicationView from 'discourse/views/application';

export default {
  name: 'extend-for-blog-post',


  initialize() {
    const createHeaderImage = function() {
      let $firstPost = $('#post-cloak-1'),
        $firstP = $firstPost.find('.cooked p').first(),
        bgURL = $firstP.find('img').attr('src'),
        $mainOutlet = $('#main-outlet'),
        topicTitle = $('.fancy-title').html(),
        $largeTitle = $('<div class="large-title-container"><h1>' + topicTitle + '</h1></div>');

      const headerHeight = $('.d-header').outerHeight(),
        headerImgHeight = 472;

      $('.container.posts').prepend($largeTitle);

      if (bgURL) {

        if (!$mainOutlet.find('.bg-container').length) {
          $mainOutlet.prepend('<div class="bg-container"></div>');
        }

        if (!$mainOutlet.find('.large-title-container').length) {
          //$('<div class="large-title-container"><h1>' + topicTitle + '</h1></div>').insertAfter($('.bg-container'));
          //$largeTitle.insertAfter($('.bg-container'));
        }

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
      } else {
        //$('.container.posts').prepend($largeTitle);
      }
    };

    const destroyHeaderImage = function() {
      $('.bg-container').remove();
      $('.large-title-container').remove();
    };

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
          createHeaderImage();
          $('.topic-meta-data').append('<div class="posted-at">' + this.get('humanDate') + '</div>');
        }
      },

      topicChanged: function () {
        let blogCategory = this.siteSettings.blog_post_category,
          categoryFullSlug = this.get('categoryFullSlug');

        if (blogCategory === categoryFullSlug) {
          $('body').addClass('blog-post');
          createHeaderImage();
          $('.topic-meta-data').append('<div class="posted-at">' + this.get('humanDate') + '</div>');
        }
      }.observes('controller.model'),
    });

    CloakedView.reopen({
      humanDate: Em.computed.alias('controller.model.humanDate'),

      didInsertElement: function () {
        this._super();
        if ($('body').hasClass('blog-post')) {
          createHeaderImage();
          $('.topic-meta-data').append('<div class="posted-at">' + this.get('humanDate') + '</div>');
        }
      },

      willDestroyElement: function () {
        if ($('body').hasClass('blog-post')) {
          $('body').removeClass('blog-post');
          destroyHeaderImage();
        }
      }
    });
  }
}

