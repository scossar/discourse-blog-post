## Discourse Blog Post

This plugin is for adding a blog-post category to Discourse. The blog post category
may be styled separately from the other Discourse categories. If an image is added
to the post before any text, that image is converted into a header background image.

### Installation

Follow the [Install a Plugin](https://meta.discourse.org/t/install-a-plugin/19157) howto, using
`git clone https://github.com/scossar/discourse-blog-post` as the plugin command.

Once you've installed it, review the settings under plugins in the admin section of your
forum.

### Use

The blog post category defaults to 'blog'. This can be changed in the plugin settings.
When a topic of the chosen blog post category is visited in the browser, the css class
`blog-post` is added to the body. Custom styles may be added to the `.blog-post` class.
