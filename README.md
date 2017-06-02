**Note:** I'm no longer supporting this plugin. I think the [WP Discourse]https://github.com/discourse/wp-discourse) WordPress plugin is a better alternative for combining styled posts with a Discourse forum. If anyone would like to take over maintaining the Discourse Blog Post plugin, that would be great.

## Discourse Blog Post

This plugin is for adding 'blog post' styles to the first post in a Discourse topic. If the post contains images, it places the first image
in a full width header above the topic. It adds the css class `blog-post` to the topic's `body` tag, and the class `blog-post-content` to
the cooked content of the post.

The ability to create blog-posts on a forum is controlled by group membership. By default, only members
of the `admins` and `moderators` groups are allowed to create blog-posts. To allow all users, trust level
1 and up, to be able to create blog posts, add the group 'trust_level_1' to the 'blog post allowed groups' setting.

Blog posts must be enabled for a category before they can be created. This is done on the plugin's settings page.
Enter the category names of the categories you want to use into the 'blog post allowed categories' setting. 
If a category is removed from the allowed categories list, blog posts that have already been created will remain.
They can be converted to regular posts either by their creator or by a site admin.

To create a blog-post in an enabled category, open the hidden ('...') post menu buttons underneath the first post
in a topic and click on the 'book' icon. That will convert the post into a blog-post and turn the 'book' icon yellow.
To convert a blog-post back into a regular post, click the 'book' icon again.

After first creating a blog-post, you will need to either revisit or refresh the page for the header image to
be hidden from the post content. Only the post creator will see the unhidden image. It's hidden from the post
by adding the css class `blog-post-image` when the post content is rendered.

The plugin adds some basic css rules for styling blog-posts. It allows you to use `<span class="large-letter"></span>` for
creating large leading letters for paragraphs.

To add further styling to blog posts on a forum, add styles to the `blog-post` class, for general page styles,
or to the `blog-post-content` class for styling the content of the posts. For example, this will increase the font
size to `20px` and set the `max-height` of the header image to `440px`.

    .blog-post-content {
        font-size: 20px;
    }
    
    .blog-post .blog-post-header-container {
        max-height: 440px;
    }
    
The plugin's default styles can be disabled by deselecting the 'blog post use default styles' checkbox on the settings
page. This could also be useful if you only wish to use the plugin's header-image function.

![alt tag](https://cloud.githubusercontent.com/assets/2975917/19752137/dfba541a-9baf-11e6-8b87-c55d6b6e4bc8.png)
![alt tag](https://cloud.githubusercontent.com/assets/2975917/19752147/f3783f12-9baf-11e6-9849-1d2450d6bef3.png)

### Installation

Follow the [Install a Plugin](https://meta.discourse.org/t/install-a-plugin/19157) howto, using
`git clone https://github.com/scossar/discourse-blog-post` as the plugin command.

Once you've installed it, go to the plugin settings page to enable the plugin and configure which groups should be
allowed to create blog posts and which categories they should be allowed to create them in.

If you have any problems with this plugin, feel free to create an issue here. Any improvements to the plugin's css would be greatly appreciated.
Pull requests are welcome.
