# name: blog-post
# about: Creates a blog-post category for Discourse
# version: 0.1
# authors: scossar
# url: https://github.com/scossar/discourse-blog-post.git

enabled_site_setting :blog_post_enabled
register_asset 'javascripts/whitelist-classes.js', :server_side
register_asset 'stylesheets/styles.scss'
