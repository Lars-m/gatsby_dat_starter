import linkExtractor from "./markdown-link-extractor";

const START_TAG = "<!--BEGIN";
const END = "##-->";
const END_TAG = "<!--END";
const SEPARATOR = "_#_";

function indexes(source, find) {
  if (!source || !find) {
    return [];
  }
  var result = [];
  for (let i = 0; i < source.length; ++i) {
    if (source.substring(i, i + find.length) === find) {
      result.push(i);
    }
  }
  return result;
}
/*
Find, and return a representing object all info for a tag.
source: The string to search
start: Start index for where to search (should be found using the index(..) method)
fullPathToNode: Use ONLY for error reporting
*/
function findFullTag(source, start, fullPathToNode) {
  let tag = {};
  const stringToCheck = source.substring(start);
  const endTagIndex = stringToCheck.indexOf(END);
  let fullTag = stringToCheck.substring(0, endTagIndex + END.length);
  if (fullTag.indexOf("\n") > -1) {
    throw new Error(
      `Tag must start and end, on the same line ${fullTag}, ${fullPathToNode}`
    );
  }
  let includeFields = fullTag
    .replace(START_TAG, "")
    .replace(END, "")
    .trim();
  tag.fullTag = fullTag;
  tag.includeFields =
    includeFields.indexOf(SEPARATOR) > -1
      ? includeFields.split(SEPARATOR).join(",")
      : includeFields;
  const endIdx = stringToCheck.indexOf(fullTag.replace(START_TAG, END_TAG));
  if (endIdx === -1) {
    throw new Error(`NO matching end-tag found for  ${fullTag}, ${fullPathToNode} 
    (Are the include sections identical, including spaces?)`);
  }
  tag.linkContent = stringToCheck.substring(fullTag.length + 1, endIdx);
  return tag;
}

/*
Find, and return an array of "tag-objects" where the includeFields in the tag-object includes the "fieldToMatch".
 - fieldToMatch: The string to search for tag-objects
 - fieldToMatch: The field to match (i.e: exerciser or guides or ... )
 - fullPathToNode: Use ONLY for error reporting
*/
export function findMatchingTags(source,fieldToMatch, fullPathToNode) {
  const tags = [];
  const startIndexes = indexes(source, START_TAG);
  const endIndexes = indexes(source, END_TAG);
  if (startIndexes.length !== endIndexes.length) {
    throw new Error(`Amount of Start and End tags are not equal in ${fullPathToNode}`);
  }
  if (startIndexes.length === 0) {
    return tags;
  }
  startIndexes.forEach(idx => {
    const tag = findFullTag(source,idx,fullPathToNode);
    if(tag.includeFields.includes(fieldToMatch)){
      // console.log(tag.linkContent);
      // const links = linkExtractor(tag.linkContent);
      // console.log("LINKS -->",links)
      tags.push(tag);
    }
  })
  return tags;
}

export function findLinksMarkedWithTag(source,fieldToMatch, fullPathToNode){
  const allLinks = [];
  const matchingTags = findMatchingTags(source,fieldToMatch, fullPathToNode);
  matchingTags.forEach(mt=>{
    linkExtractor(mt.linkContent).forEach(l=>allLinks.push(l));
  })
  return allLinks;
}



/* 
  see contacts for a test
*/