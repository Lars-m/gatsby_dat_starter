import { graphql } from "gatsby";
import React from "react";
import Layout from "../components/layout";
import makeUlForGoals from "../helpers/goalHelper";
import { getDayInWeekFromDkDate } from "../helpers/date_utils";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from "react-accessible-accordion";

export default ({ data }) => {
  const goals = data.allLearningGoal.nodes;
  const goalsGrouped = {};
  let header = "";
  goals.forEach(g => {
    const h = `Period-${g.period} (Week-${g.week})`;
    if (h !== header) {
      goalsGrouped[h] = [];
      header = h;
    }
    let day = "";
    try {
      const aDay = getDayInWeekFromDkDate(g.day);
      day = aDay + (<br />) ? aDay : "";
    } catch (e) {}
    const title = <React.Fragment>{day} <br/> {g.day}</React.Fragment>
    goalsGrouped[h].push({ day: title, goals: makeUlForGoals(g) });
  });
  const accordionItems = [];
  let id = 0;
  for (let property in goalsGrouped) {
    id++;
    const rows = goalsGrouped[property].map((g, idx) => (
      <tr key={idx}>
        <td>{g.day}</td>
        <td>{g.goals}</td>
      </tr>
    ));
    const accordionGroup = (
      <AccordionItem key={id}>
        <AccordionItemHeading>
          <AccordionItemButton>{property}</AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <table>
            <tbody>{rows}</tbody>
          </table>
        </AccordionItemPanel>
      </AccordionItem>
    );
    accordionItems.push(accordionGroup);
  }


  return (
    <Layout>
      <h2>Learning Goals (Period-1)</h2>
      <p>All learning goals, listed pr. period/week</p>
      <Accordion allowZeroExpanded={true} >
        {accordionItems}
      </Accordion>
    </Layout>
  );
};

export const query = graphql`
  query {
    allLearningGoal {
      nodes {
        id
        day
        topic
        week
        period
        goals
      }
    }

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
          shortTitle
        }
      }
    }
  }
`;
