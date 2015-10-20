import TopicView from 'discourse/views/topic';
import CloakedView from 'discourse/views/cloaked';
import TopicModel from 'discourse/models/topic';
import ComposerView from 'discourse/views/composer';

function generateHeaderImage() {
  var $firstPost = $('#post-cloak-1'),
    $firstP = $firstPost.find('.cooked p').first(),
  //bgURL = $firstP.find('img').attr('src'),
    $bgImg = $firstP.find('img'),
    bgURL = $bgImg.attr('src'),
    imgHeight = $bgImg.attr('height'),
    imgWidth = $bgImg.attr('width'),
    bgRatio = imgHeight / imgWidth,
    $mainOutlet = $('#main-outlet'),
    bgImgWidth = $mainOutlet.width(),
    topicTitle = $('.fancy-title').html(),
    $largeTitle = $('<div class="large-title-container"><h1>' + topicTitle + '</h1></div>'),
    bgImgMaxHeight = 472,
    bgImgHeight;

  // #topic-title is being hidden with css. .large-title-container is used instead.
  $('.container.posts').prepend($largeTitle);

  // If there is an image in the first paragraph:
  if (bgURL) {
    if (!$mainOutlet.find('.bg-container').length) {
      $mainOutlet.prepend('<div class="bg-container"></div>');
    }

    // Remove the image p so it doesn't display twice
    $firstP.remove();

    bgImgHeight = (bgImgMaxHeight < bgImgWidth * bgRatio) ? bgImgMaxHeight : bgImgWidth * bgRatio;


    $('.bg-container').css({
      'height': bgImgHeight + 'px',
      'background-image': 'url(' + bgURL + ')',
      'background-repeat': 'no-repeat',
      'background-size': '100% auto', // + windowHeight + 'px',
    });

    $('.large-title-container').css({
      'padding-top': bgImgHeight + 'px',
    });

    // Adjusts bg-image height on browser resize
    adjustForResize(bgImgMaxHeight, bgRatio);
  }
}

function resizeBackground(event) {
  var imgWidth = $('#main-outlet').width(),
    newHeight = (event.data.bgImgMaxHeight < imgWidth * event.data.bgRatio) ? event.data.bgImgMaxHeight : imgWidth * event.data.bgRatio;

  console.log('new max height', newHeight);
  $('.bg-container').css('height', newHeight + 'px');
  $('.large-title-container').css('padding-top', newHeight + 'px');
}

function adjustForResize(maxHeight, imgRatio) {
  $(window).on('resize', {
    bgImgMaxHeight: maxHeight,
    bgRatio: imgRatio
  }, resizeBackground);
}

function generateBlogTopic(blogCategory, categoryFullSlug, postDate) {
  if (blogCategory === categoryFullSlug) {
    $('body').addClass('blog-post');
    generateHeaderImage();
    $('.topic-meta-data').append('<div class="posted-at">' + postDate + '</div>');
  }
}

function destroyBlog() {
  if ($('body').hasClass('blog-post')) {
    $('body').removeClass('blog-post');
    $('.bg-container').remove();
    $('.large-title-container').remove();
    $(window).off('resize', adjustForResize);
  }
}

function isBlog() {
  return $('body').hasClass('blog-post');
}

export default {
  name: 'extend-for-blog-post',

  initialize() {
    // Create a typical 'posted at' date - this needs to be improved
    TopicModel.reopen({
      humanDate: function () {
        let postDate = new Date(this.get('created_at')).toLocaleDateString();
        return postDate;
      }.property('created_at'),
    });

    TopicView.reopen({
      humanDate: Em.computed.alias('controller.model.humanDate'),

      didInsertElement: function () {
        this._super();
        generateBlogTopic(this.siteSettings.blog_post_category, this.get('categoryFullSlug'), this.get('humanDate'));
        console.log('did insert');
      },

      topicChanged: function () {
        Ember.run.scheduleOnce('afterRender', this, function () {
          generateBlogTopic(this.siteSettings.blog_post_category, this.get('categoryFullSlug'), this.get('humanDate'));
          console.log('topic changed');
        });
      }.observes('controller.model'),
    });

    CloakedView.reopen({
      humanDate: Em.computed.alias('controller.model.humanDate'),

      didInsertElement: function () {
        this._super();
        var blogCategory = this.siteSettings.blog_post_category,
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

