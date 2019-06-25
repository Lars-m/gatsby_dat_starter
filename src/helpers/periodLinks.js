import { getDateFromDkDate } from "./date_utils.js";

/*
returns all links for a period given via the slug
*/
function periodLinks(nodes, folder) {
  const days = nodes
    .filter(node => {
      return node.fields.inFolder === folder && !node.fields.isIndex;
    })
    .map(e => {
      e.sortField = getDateFromDkDate(e.fields.shortTitle)
        .toString()
        .toLowerCase();
      return e;
    });
  //const sorted = days.sort((a, b) => a.sortField - b.sortField);

  const sorted = days.sort((a, b) => (a.sortField >= b.sortField ? 1 : -1));
  //console.log("Sorted", sorted);
  return sorted;
}
export default {
  //linkFacade: linkFacade,
  periodLinks: periodLinks
};
