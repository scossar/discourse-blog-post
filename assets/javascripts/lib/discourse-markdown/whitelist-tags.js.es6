import { registerOption } from 'pretty-text/pretty-text';

registerOption((siteSettings, opts) => {
  opts.features["text-direction"] = true;
});


export function setup(helper) {
  helper.whiteList(['span.large-letter']);
}