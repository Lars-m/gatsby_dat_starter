import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
//import all from "../helpers/periodLinks";
import "../../style.css";
import {getOverridenPageInfo} from "../helpers/node-helper";
import makeUlForGoals from "../helpers/goalHelper";

//To Style (add line breaks) frontmatter
// Uses example from here: https://github.com/gatsbyjs/gatsby/issues/5021
import remark from "remark";
import recommended from "remark-preset-lint-recommended";
import remarkHtml from "remark-html";

function getDayInfo(data, selectedClass) {
  let dayInfo;
  const timeEditURL = data.site.siteMetadata.timeEdit;

  if (!selectedClass) {
    console.error("No Class Selected, cannot provide class details");
    return dayInfo;
  }
  const infoForDay = data.dayInfo;
  let details = null;
  if (infoForDay) {
    details = <a href={timeEditURL}>See TimeEdit</a>;
    const info = JSON.parse(infoForDay.dayInfo);
    const infoClass = info[selectedClass];
    if (!infoClass || !('teacher' in infoClass) ||!('room' in infoClass) ||!('time' in infoClass)) {
      console.error(
        `No info found for class: ${selectedClass}. Is class columns for this class defined in sheet `,
        data.markdownRemark.fields.shortTitle,infoClass
      );
      return details;
    }
    const {teacher,room,time} = infoClass;
    if (teacher === null && room === null && time === null) {
      return details;
    } else {
      const _teacher = teacher || <a href={timeEditURL}>See TimeEdit</a>;
      const _room = room || <a href={timeEditURL}>See TimeEdit</a>;
      const _time = time || <a href={timeEditURL}>See TimeEdit</a>;
      details = `Teacher: ${_teacher}, Classroom: ${_room}, Time: ${_time}`;
    }
  }
  return details;
}

// function getOverriddenInfo(nodes,selectedClass, data) {
//   let replacementHTML = null;
//   if (!selectedClass) {
//     console.error("No Class Selected, cannot provide overridden page-info");
//     return replacementHTML;
//   }
//   nodes.forEach(node => {
//     if (selectedClass) {
//       const searchString = `pages/${data.markdownRemark.fields.inFolder}/${selectedClass}/${data.markdownRemark.fields.fileName.base}`;
//       nodes.forEach(n => {
//         if (searchString === n.fields.fileName.relativePath) {
//           console.log("FOUND -> ", n.fields.fileName.relativePath);
//           replacementHTML = n.html;
//         }
//       });
//     }
//   });
//   return replacementHTML;
// }

export default ({ data }) => {
  const post = data.markdownRemark;
  const learningGoal = data.learningGoal;
  let dayInfo = null;
  let title = post.fields.title;
  let periodInfoHtml = null;
  let periodTitle = null;
  const nodes = data.allMarkdownRemark.nodes;
  let replacementHTML = null;

  if (typeof window !== `undefined`) {
    const selectedClass = localStorage.selectedClass
      ? JSON.parse(localStorage.selectedClass).value
      : null;
    dayInfo = getDayInfo(data, selectedClass);
    const folder = data.markdownRemark.fields.inFolder;
    const fileName = data.markdownRemark.fields.fileName.base;
    replacementHTML = getOverridenPageInfo(nodes,selectedClass, folder,fileName);
  }

  if (data.site.siteMetadata.showWeekInfoForEachDayInWeek) {
    nodes.forEach(node => {
      if (node.fields.isIndex && node.fields.inFolder === post.fields.inFolder) {
 
        periodTitle = node.fields.title;
        periodInfoHtml = node.html;
      }
    });
  }

  const pageInfo = post.frontmatter.pageintro
    ? remark()
        .use(recommended)
        .use(remarkHtml)
        .processSync(post.frontmatter.pageintro)
        .toString()
    : "";
  const goals = learningGoal ? (
    <React.Fragment>
      <h3 style={{ color: "#295683" }}>After this day you are expected to :</h3>
      {makeUlForGoals(learningGoal)}
    </React.Fragment>
  ) : (
    ""
  );

  return (
    <Layout>
      <div>
        {periodInfoHtml && (
          <div className="period-info">
            <h3>{periodTitle}</h3>
            <div dangerouslySetInnerHTML={{ __html: periodInfoHtml }} />
          </div>
        )}
        <h2 style={{ color: "#295683" }}>{title} </h2>
        <div
          style={{ fontStyle: "italic", padding: 2, color: "darkgreen" }}
          dangerouslySetInnerHTML={{ __html: pageInfo }}
        />
        <div> {goals}</div>
        <div>
          {" "}
          {dayInfo && (
            <h3>
              Teacher/room/time:{" "}
              <span style={{ fontSize: "smaller", color: "darkGray" }}>
                {dayInfo}
              </span>
            </h3>
          )}
        </div>
        <hr />
        <div
          dangerouslySetInnerHTML={{ __html: replacementHTML || post.html }}
        />
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!, $shortTitle: String!) {
    learningGoal(day: { eq: $shortTitle }) {
      id
      day
      week
      period
      goals
    }

    dayInfo(day: { eq: $shortTitle }) {
      id
      day
      week
      period
      dayInfo
    }

    site {
      siteMetadata {
        timeEdit
        showWeekInfoForEachDayInWeek
      }
    }

    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        slug
        shortTitle
        inFolder
        title
        fileName {
          base
        }
      }
      frontmatter {
        pageintro
        headertext
      }
    }
    allMarkdownRemark {
      nodes {
        html
        frontmatter {
          pageintro
        }
        fields {
          slug
          inFolder
          title
          isIndex
          fileName {
            relativePath
            base
          }
        }
      }
    }
  }
`;


