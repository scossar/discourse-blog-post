## Discourse Blog Post

This plugin is for adding 'blog post' styles to the first post in a Discourse topic. If the post contains images, it places the first image
in a full width header above the topic. It adds the css class `blog-post` to the topic's `body` tag, and the class `blog-post-content` to
the cooked content of the post.

The ability to create blog-posts on a forum is controlled by group membership. By default, only members
of the `admins` and `moderators` groups are allowed to create blog-posts.

Blog posts must be enabled for a category before they can be created. This is done in the category/edit/settings modal.

Blog posts can be turned back to regular posts, either by the topic owner, or by a forum admin.

The plugin adds some basic css rules for styling blog-posts. It allows you to use `<span class="large-letter"></span>` for
creating large leading letters for paragraphs.

To add further styling to blog posts on a forum, add styles to the `blog-post` class, for general page styles,
or to the `blog-post-content` class for styling the content of the posts. For example, this will increase the font
size to `20px` and set the `max-height` of the header image to `440px`.

    .blog-post-content {
        font-size: 20px;
    }
    
    .blog-post .blog-post-header-container {
        width: 100%;
        max-height: 440px;
        overflow: hidden;
    }
    

![alt tag](https://cloud.githubusercontent.com/assets/2975917/19636010/48bb2fb6-997b-11e6-9418-3f9af44e77a7.png)


### Installation

Follow the [Install a Plugin](https://meta.discourse.org/t/install-a-plugin/19157) howto, using
`git clone https://github.com/scossar/discourse-blog-post` as the plugin command.

Once you've installed it, go to the plugin settings page to enable the plugin and configure which groups should be
allowed to create blog posts. Then, select the 'Allow blog posts' setting in the category edit modal for any categories that you wish to use.

If you have any problems with this plugin, feel free to create an issue here. Any improvements to the plugin's css would be greatly appreciated.
Pull requests are welcome.