import { registerOption } from 'pretty-text/pretty-text';

registerOption((siteSettings, opts) => {
  opts.features['blog-post-whitelist'] = !!siteSettings.blog_post_enabled;
});

export function setup(helper) {
  helper.whiteList([ 'span.large-letter']);
}
