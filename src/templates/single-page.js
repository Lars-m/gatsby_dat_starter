import React from "react";
import { graphql} from "gatsby";
import Layout from "../components/layout";

//To Style (add line breaks) frontmatter
// Uses example from here: https://github.com/gatsbyjs/gatsby/issues/5021
import remark from "remark";
import recommended from "remark-preset-lint-recommended";
import remarkHtml from "remark-html";

export default ({ data }) => {
  const post = data.markdownRemark;
  const title = post.frontmatter.title;
  const pageInfo = remark()
    .use(recommended)
    .use(remarkHtml)
    .processSync(post.frontmatter.headertext)
    .toString();
  return (
    <Layout>
      <div>
        <div
          style={{
            backgroundColor: "#295683",
            borderRadius: 5,
            color: "white",
            padding: 16,
            paddingTop: 1
          }}
        >
          <h1>{title}</h1>
          {/* <div>{post.frontmatter.headertext}</div> */}
          { <div dangerouslySetInnerHTML={{ __html: pageInfo }} /> }
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        slug
      }
      frontmatter {
        title
        date
        headertext
      }
    }
  }
`;
