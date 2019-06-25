import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { getLinks } from "../helpers/linkCollector";

function autoInsertLinksForWeek(data) {
  const post = data.markdownRemark;
  const raw = post.rawMarkdownBody;
  //Markdown should only contain one entity like the one below. If not, only the first will be used
  const start =
    raw.indexOf("<!--PeriodExercises") + "<!--PeriodExercises".length + 1;
  const end = raw.indexOf("PeriodExercises-->");
  
  if (start === -1 || end === -1 || start > end) {
    console.error(
      "Illegal syntax for <!--PeriodExercises period/week PeriodExercises-->"
    );
    return;
  }
  let link = raw.substring(start, end);
  if (link) {
    link = link.trim();
  }
  const links = getLinks(
    data,
    "exercises",
    true,
    link
  );
    if (!links || links.length === 0) {
    return;
  }
  const tableRows = links
    //.map(l => `<tr><td>${l.shortTitle}</td><td>${l.html}</td></tr>`)
    .map(l => `<tr><td>${l.shortTitle}</td><td>${l.htmlLinks.map(hl=>hl.html).join(" <br/> ")}</td></tr>`)
    .join("");
  if (!tableRows || tableRows.length === 0) {
    return;
  }
  const table = `<table><tbody>${tableRows}<tbody></table>`;
  const startHtml =post.html.indexOf("<!--PeriodExercises");
  const htmlWithLinks =
    post.html.substring(0, startHtml) + table + post.html.substring(startHtml);
  return htmlWithLinks;
}

export default ({ data }) => {
  const post = data.markdownRemark;
  const title = <React.Fragment>
    <h1 style={{marginTop:10}}>Study Point Friday Exercises</h1>
    <h3 style={{margin:0}}>{post.fields.shortTitle}</h3>
    <h3>{post.fields.title}</h3>
  </React.Fragment>;
  const htmlWithLinks= autoInsertLinksForWeek(data);

  return (
    <Layout>
      <div>
        <div style={{
            backgroundColor: "#295683",
            borderRadius: 5,
            color: "white",
            padding: 16,
            paddingTop: 1,
            marginTop: 20,
            marginBottom: 15,
          }}
        >
          {title}
        </div>
        <div dangerouslySetInnerHTML={{ __html: htmlWithLinks || post.html }} />
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      rawMarkdownBody
      fields {
        slug
        title
        shortTitle
      }
      frontmatter {
        title
        date
        headertext
      }
    }

    allMarkdownRemark {
      totalCount
      nodes {
        id
        rawMarkdownBody
        frontmatter {
          title
          pageintro
        }
        fields {
          slug
          title
          shortTitle
          depth
          inFolder
          title
          fileName {
            relativePath
            base
          }
        }
      }
    }
  }
`;
