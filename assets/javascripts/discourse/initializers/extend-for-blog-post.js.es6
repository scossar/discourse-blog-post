import TopicView from 'discourse/views/topic';
import CloakedView from 'discourse/views/cloaked';
import TopicModel from 'discourse/models/topic';
import TopicController from 'discourse/controllers/topic';

/*
function generateHeaderImage() {
  var $firstPost = $('#post-cloak-1'),
    $headerImages = $firstPost.find('img.header-image'),
    $bgImg = $headerImages.first(),
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

  if (bgURL) {
    if (!$mainOutlet.find('.bg-container').length) {
      $mainOutlet.prepend('<div class="bg-container"></div>');
    }

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
} */

export default {
  name: 'extend-for-blog-post',

  initialize() {

    //CloakedView.reopen({
    //  humanDate: Em.computed.alias('controller.model.humanDate'),
    //
    //  didInsertElement: function () {
    //    this._super();
    //    let blogCategory = this.siteSettings.blog_post_category,
    //      categoryFullSlug = 'category-' + blogCategory;
    //    if (categoryFullSlug === blogCategory) {
    //      $('body').addClass('blog-post');
    //    } else {
    //      $('body').removeClass('blog-post');
    //    }
    //  },
    //
    //  willDestroyElement: function () {
    //    this._super();
    //    $('body').removeClass('blog-post');
    //  },
    //});

    TopicModel.reopen({
      //humanDate: function () {
      //  let postDate = new Date(this.get('created_at')).toLocaleDateString();
      //  return postDate;
      //}.property('created_at'),
      //
      //blogClass: function () {
      //  let blogCategory = this.siteSettings.blog_post_category;
      //  return blogCategory.replace(/ /g, '-');
      //}.property(),
      //
      //isBlog: function () {
      //  let currentCategory = this.get('category.fullSlug');
      //  return this.blogClass === currentCategory;
      //}.property('category.fullSlug'),
      //
      //firstPost: function () {
      //  return this.get('postStream.posts')[0]['cooked'];
      //}.property('postStream.posts'),

    });

    TopicController.reopen({
    });

    //TopicView.reopen({
    //  isBlog: Em.computed.alias('controller.model.isBlog'),
    //  firstPost: Em.computed.alias('controller.model.firstPost'),
    //
    //  hasHeaderImages: function() {
    //    let firstPost = this.firstPost;
    //    $postChildren = $($(firstPost).parseHTML()).children();
    //    console.log('fired from has header images', $postChildren.length);
    //  }.property('firstPost'),
    //
    //  blogBodyClass: function () {
    //    if (this.isBlog) {
    //      console.log('first post');
    //      $('body').addClass('blog-post');
    //    }
    //  }.on('didInsertElement'),
    //
    //  addHeaderImage: function () {
    //  }.on('didInsertElement'),
    //
    //  removeBlogBodyClass: function () {
    //    $('body').removeClass('blog-post');
    //  }.on('willDestroyElement'),
    //});
  }
}
