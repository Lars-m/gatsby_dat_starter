import marked from "marked";
const emoji = require(`emojione`);

//Changed from this package to return both text and link: https://github.com/tcort/markdown-link-extractor
export default function markdownLinkExtractor(markdown) {
  var links = [];

  var renderer = new marked.Renderer();

  // Taken from https://github.com/markedjs/marked/issues/1279
  //var linkWithImageSizeSupport = /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?)\]\(\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?(?:\s+=(?:[\w%]+)?x(?:[\w%]+)?)?)(?:\s+("(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/;
  
  // eslint-disable-next-line
  var linkWithImageSizeSupport = /^!?\[((?:\[[^[\]]*\]|\\[[\]]?|`[^`]*`|[^[\]\\])*?)\]\(\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?(?:\s+=(?:[\w%]+)?x(?:[\w%]+)?)?)(?:\s+("(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/;
  

  marked.InlineLexer.rules.normal.link = linkWithImageSizeSupport;
  marked.InlineLexer.rules.gfm.link = linkWithImageSizeSupport;
  marked.InlineLexer.rules.breaks.link = linkWithImageSizeSupport;
  
  renderer.link = function (href, title, text) {
      if(text.startsWith(":")){
          //Replace emoji shortname (:smile:  for example, with unicode)
          const endIndex = text.indexOf(":",1);
          const code = text.substring(0,endIndex+1);
          //console.log("CODE",code)
          text = text.substring(endIndex);
          text = emoji.shortnameToUnicode(code)+text;
      }
      links.push({href,text});
  };
  renderer.image = function (href, title, text) {
      // Remove image size at the end, e.g. ' =20%x50'
      href = href.replace(/ =\d*%?x\d*%?$/, "");
      links.push(href);
  };
  marked(markdown, { renderer: renderer });

  links = links.map(link => {
    const linkIsExternal = link.href.startsWith("http");
    const target = linkIsExternal ? 'target="_blank"' : "";
    link.html = `<a href=${link.href} ${target}>${link.text}</a>`;
    return link;
  })
  return links;
};