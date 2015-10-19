import TopicView from 'discourse/views/topic';
import CloakedView from 'discourse/views/cloaked';

export default {
  name: 'extend-for-blog-post',


  initialize() {
    const createHeaderImage = function () {
      let $firstPost = $('#post-cloak-1'),
        $firstP = $firstPost.find('.cooked p').first(),
        bgURL = $firstP.find('img').attr('src'),
        $mainOutlet = $('#main-outlet');

      const headerHeight = $('.d-header').outerHeight(),
        headerImgHeight = 440,
        topicTitle = $('.fancy-title').html();

      if (bgURL) {

        $('#topic-title').css('display', 'none');

        if (!$mainOutlet.find('.bg-container').length) {
          $mainOutlet.prepend('<div class="bg-container"></div>');
        }

        if (!$mainOutlet.find('.large-title-container').length) {
          $('<div class="large-title-container"><h1>' + topicTitle + '</h1></div>').insertAfter($('.bg-container'));
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
      }
    };

    const destroyHeaderImage = function () {
      $('.bg-container').remove();
      $('.large-title-container').remove();
    };

    TopicView.reopen({
      didInsertElement: function () {
        this._super();
        let blogCategory = this.siteSettings.blog_post_category,
          categoryFullSlug = this.get('categoryFullSlug');

        if (blogCategory === categoryFullSlug) {
          $('body').addClass('blog-post');
        }
      },
    });

    CloakedView.reopen({
      didInsertElement: function () {
        this._super();
        if ($('body').hasClass('blog-post')) {
          createHeaderImage();
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

