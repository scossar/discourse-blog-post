## Discourse Blog Post

This plugin is for adding a blog-post category to Discourse. The blog post category
may be styled separately from the other Discourse categories.

### Installation

Follow the [Install a Plugin](https://meta.discourse.org/t/install-a-plugin/19157) howto, using
`git clone https://github.com/scossar/discourse-blog-post` as the plugin command.

Once you've installed it, review the settings under plugins in the admin section of your
forum.


### Use

The blog post category defaults to 'blog'. This can be changed in the plugin settings.
When a topic of the chosen blog post category is visited in the browser, the css class
`.blog-post` is added to the body. Custom styles may be added to the `.blog-post` class.


#### Creating a header image for the post

Upload an image in the Discourse editor and add `class="header-image"` to the img tag.
The header-image height can be set by adding an optional data-attribute `data-max-height` to the
`img` tag. `data-max-height` accepts only a number, with no units, for its value.

Here is an example of an image tag that sets a header-image with a max height of 500px.
`<img src="/uploads/default/original/1X/103a294fe350cf4fbaee1ca6d9cc162230d7b90f.jpg" width="690" height="461" class="header-image" data-max-height="500">`
Note that the `class` and the `data-max-height` attributes have been added to the tag.

#### Creating large letters

Letters placed inside of `<span class="large-letter"></span>` tags will be given a default
style of `font-size: 36px` That may be adjusted as a custom style.

### Suggestions for improvement

Pull requests and suggestions for improvement are welcome.
