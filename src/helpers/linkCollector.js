import { getDateFromDkDate } from "./date_utils";
import { getOverridenPageInfoRaw } from "./node-helper";
import { findLinksMarkedWithTag } from "./tagFinder";

export function getLinksFromFrontMatter(data,prop,removeDuplicates,lookOnlyInThisFolder){
  let nodes = data.allMarkdownRemark.nodes.filter(
    //TODO: Could links just live anywhere, also in index files
    node =>
      !node.fields.isIndex & (node.fields.depth >= 1 && node.fields.depth < 3) //Only look down to single-day level (levels below can contain overrides)
  );
  if (lookOnlyInThisFolder) {
    nodes = nodes.filter(n =>
      n.fields.inFolder.startsWith(lookOnlyInThisFolder)
    );
  }
  let allLinks = [];

  nodes.forEach(node => {
    
    //TODO --> GET OVERRIDEN PAGES
    
    if(node.frontmatter[prop] && node.frontmatter[prop] === true){

      const link = {};
      link.html = [`<a href=${node.fields.slug}>${node.fields.shortTitle}</>`]
      allLinks.push({
        title: `${node.fields.shortTitle} - ${node.fields.title}`,
        shortTitle: node.fields.shortTitle,
        sortField: getDateFromDkDate(node.fields.shortTitle)
          .toString()
          .toLowerCase(),
        id: node.id,
        info: node.frontmatter.pageintro,
        slug: node.fields.slug,
        htmlLinks:[link]
      });
    }
  });
  return allLinks
    .filter(l => l.htmlLinks.length > 0)
    .sort((a,b) => a.shortTitle > b.shortTitle ? 1: -1);
}



export function getLinks(data, tag, removeDuplicates, lookOnlyInThisFolder) {
  let nodesBelowLevel3 = data.allMarkdownRemark.nodes.filter(
    //TODO: Could links just live anywhere, also in index files
    node =>
      !node.fields.isIndex & (node.fields.depth >= 1 && node.fields.depth < 3) //Only look down to single-day level (levels below can contain overrides)
  );
  let allNodes = data.allMarkdownRemark.nodes.filter(
    node =>!node.fields.isIndex & (node.fields.depth >= 1 ));//We want possible overrides for this one
  if (lookOnlyInThisFolder) {
    nodesBelowLevel3 = nodesBelowLevel3.filter(n =>n.fields.inFolder.startsWith(lookOnlyInThisFolder));
    allNodes = allNodes.filter(n =>n.fields.inFolder.startsWith(lookOnlyInThisFolder));
  }
  const allUniqueLinksFound = [];
  let allLinks = [];
  let linksFound = [];
  nodesBelowLevel3.forEach(node => {
    let rawMarkdown = getOverridenPageInfoRaw(allNodes, node);
    rawMarkdown = rawMarkdown || node.rawMarkdownBody;
    try {
      linksFound = findLinksMarkedWithTag(
        rawMarkdown,
        tag,
        node.fileAbsolutePath
      ); //TODO: This is not the real fileAbsolutePath passed down, if rawmarkdown was from a overriden file
      if (removeDuplicates) {
        linksFound = linksFound.filter(found => {
          if (allUniqueLinksFound.filter(ul => found.href === ul.href).length === 0) {
            allUniqueLinksFound.push(found);
            return true;
          }
          return false;
        });
      }
    } catch (err) {
      console.error(err.message);
    }

    if (linksFound.length > 0) {
      allLinks.push({
        title: `${node.fields.shortTitle} - ${node.fields.title}`,
        shortTitle: node.fields.shortTitle,
        //sortField: node.fields.shortTitle,
         sortField: getDateFromDkDate(node.fields.shortTitle)
           .toString()
           .toLowerCase(),
        id: node.id,
        info: node.frontmatter.pageintro,
        slug: node.fields.slug,
        htmlLinks: linksFound
      });
    }
  });
  allLinks = allLinks.sort((a,b) => a.sortField > b.sortField ? 1: -1);
  return allLinks
    .filter(l => l.htmlLinks.length > 0)
    //.sort((a, b) => b.shortTitle - a.shortTitle);
}

/*
 */
export default function LinkCollector({ data, tag, removeDuplicates, render }) {
  const links = getLinks(data, tag, removeDuplicates);
  return render(links);
}
export function LinkCollectorFromFrontMatter({ data, prop, removeDuplicates, render }) {
  const links = getLinksFromFrontMatter(data, prop, removeDuplicates);
  return render(links);
}
