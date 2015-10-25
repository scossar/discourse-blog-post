(function () {
  Discourse.Markdown.whiteListTag('span', 'class', 'large-letter');
  Discourse.Markdown.whiteListTag('img', 'class', 'header-image');
  Discourse.Markdown.whiteListTag('img', 'data-max-height', /\d+/ );
})();