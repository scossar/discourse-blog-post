import {withPluginApi} from 'discourse/lib/plugin-api';

function initializePlugin(api) {
  api.decorateWidget('poster-name:after', function(helper) {
    return helper.h('input', {
      type: 'checkbox',
      name: 'send-to-wordpress',
      value: 1
    });
  });

}

export default {
  name: 'extend-for-blog-post',
  initialize() {
    withPluginApi('0.1', api => initializePlugin(api));
  }
}