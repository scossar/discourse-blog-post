## Discourse Blog Post

This plugin is for adding a blog-post category to Discourse. The blog post category
may be styled separately from the other Discourse categories.

### Installation

Follow the [Install a Plugin](https://meta.discourse.org/t/install-a-plugin/19157) howto, using
`git clone https://github.com/scossar/discourse-blog-post` as the plugin command.

Once you've installed it, review the settings under plugins in the admin section of your
forum.

### Warning

This plugin was developed as a 'proof of concept.' Use it on production sites at
your own risk.

Pull requests and suggestions for improvement are welcome.

### Use

The blog post category defaults to 'blog'. This can be changed in the plugin settings.
When a topic of the chosen blog post category is visited in the browser, the css class
`.blog-post` is added to the body. Custom styles may be added to the `.blog-post` class.

#### Creating a header image for the post

Upload an image in the Discourse editor and add `class="header-image"` to the image tag.

#### Creating large letters

Letters placed inside of `<span class="large-letter"></span>` tags will be given a default
style of `font-size: 36px` That may be adjusted as a custom style.
