import { graphql } from "gatsby";
import LinkCollector from "../helpers/linkCollector";
import React from "react";
import Layout from "../components/layout";

export default ({ data }) => {
  return (
    <Layout>
      <div>
        <h2>All Exercises given this semester</h2>
        <LinkCollector
          data={data}
          tag="exercises"
          removeDuplicates={true}
          render={allLinks => (
            <table>
              <tbody>
                {allLinks.map(d => {
                  const html = d.htmlLinks.map(l=>l.html).join("<br/>")
                  return (
                  <tr key={d.id}>
                    <td>{d.title}</td>
                    <td dangerouslySetInnerHTML={{ __html: html }} />
                  </tr>
                )})} 
              </tbody>
            </table>
          )}
        />
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
