import { getDateFromDkDate } from "./date_utils";
import linkExtractor from "./markdown-link-extractor";
import { getOverridenPageInfoRaw } from "./node-helper";

function getTheLinks(
  rawMarkdownBody,
  start,
  end,
  allLinksFound,//Used to filter out duplicates
  removeDuplicates,
  useLineBreaks
) {
  
  const linkPartOfBody = rawMarkdownBody.substring(start, end);
  let linksFound = linkExtractor(linkPartOfBody)
    .map(link => {
      const linkIsExternal = link.href.startsWith("http");
      const target = linkIsExternal ? 'target="_blank"' : "";
      const returnLink = `<a href=${link.href} ${target}>${link.text}</a>`;
      // ? `<a href=${link.href} target="_blank">${link.text}</a>`
      // : `<a href=${link.href}>${link.text}</a>`;
      const duplicate = allLinksFound.includes(link.href);
      if (duplicate && removeDuplicates) {
        return null;
      } else {
        allLinksFound.push(link.href);
      }
      return returnLink;
    })
    .filter(l => l != null); //Remove the null entries
  let separator = useLineBreaks ? "<br/>" : " | ";
  separator = linksFound.length > 1 ? separator : "";
  //return linksFound;
  return linksFound.join(separator);
}

export function getLinks(data, startTag, endTag, useLineBreaks, removeDuplicates,lookOnlyInThisFolder) {
  const allLinksFound = [];
  
  let nodes = data.allMarkdownRemark.nodes.filter(
    //TODO: Could links just live anywhere, also in index files
    node => !node.fields.isIndex & (node.fields.depth >= 1)
  );
 
  //TODO --> Decide whether this should be removed
  if(lookOnlyInThisFolder){
    nodes = nodes.filter(n=>n.fields.inFolder.startsWith(lookOnlyInThisFolder));
  }
  const links = nodes
    .filter(node=>node.fields.depth < 3)  //Only look down to single-day level (levels below can contain overrides)
    .map(node => {
      const dateForTitle = `${node.fields.shortTitle}`;
      let rawMarkdownBody = null;

      if (typeof window !== `undefined`) {
        const selectedClass = localStorage.selectedClass
          ? JSON.parse(localStorage.selectedClass).value
          : null;
        const folder = node.fields.inFolder;
        const fileName = node.fields.fileName.base;
        rawMarkdownBody = getOverridenPageInfoRaw(nodes, selectedClass, folder,fileName);
      }
      rawMarkdownBody = rawMarkdownBody ||  node.rawMarkdownBody
      const start = rawMarkdownBody.indexOf(startTag) + startTag.length;
      const end = rawMarkdownBody.indexOf(endTag);
      let htmlLinks = null;
      if (start > -1 && end > -1 && end > start) {
        htmlLinks = getTheLinks(
          rawMarkdownBody,
          start,
          end,
          allLinksFound,
          removeDuplicates,
          useLineBreaks  
        );
      }
     
      return {
        title: `${dateForTitle} - ${node.fields.title}`,
        shortTitle:dateForTitle,
        sortField: getDateFromDkDate(node.fields.shortTitle)
          .toString()
          .toLowerCase(),
        id: node.id,
        info: node.frontmatter.pageintro,
        slug: node.fields.slug,
        htmlLinks
      };
    })
    .filter(d => d.htmlLinks)
    .sort((a, b) => a.sortField - b.sortField);
  return links;
}

/*
  Tags must always be defined using the pattern:
  <!--NAME_begin--> and <!--NAME_end-->
*/
export default function LinkCollector({
  data,
  tag,
  useLineBreaks,
  removeDuplicates,
  render
}) {
  const start = `<!--${tag}_begin-->`;
  const end = `<!--${tag}_end-->`;
  const links = getLinks(data, start, end, useLineBreaks, removeDuplicates);
  return render(links);
}

