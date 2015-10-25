(function () {
  Discourse.Markdown.whiteListTag('span', 'class', 'large-letter');
  Discourse.Markdown.whiteListTag('img', 'class', 'header-image');
  Discourse.Markdown.whiteListTag('img', 'data-max-height', '*' );
  Discourse.Markdown.whiteListTag('img', 'class', 'one-third');
  Discourse.Markdown.whiteListTag('img', 'class', 'one-half');
  Discourse.Markdown.whiteListTag('img', 'class', 'two-thirds');
})();