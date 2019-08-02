import { graphql } from "gatsby";
import React from "react";
import Layout from "../components/layout";
import {makeUlForGoalsV2} from "../helpers/goalHelper";
import { getDayInWeekFromDkDate } from "../helpers/date_utils";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from "react-accessible-accordion";

export default ({ data }) => {
  console.log(data)
  const allNodes = data.allMarkdownRemark.nodes;
  //Get all nodes with VALID Json-parsable data
  const nodesWithGoals = allNodes.filter(node=>{
    if(!node.frontmatter.learningGoals){
      return false;
    }
    try{
      JSON.parse(node.frontmatter.learningGoals)
      return true;
    } catch (err){
      return false;
    }
  });
  console.log("With",nodesWithGoals)
  const goals = nodesWithGoals.map(node=>JSON.parse(node.frontmatter.learningGoals))
  goals.sort((a,b)=>a.week > b.week? 1 : -1)
  console.log("Goals",goals)
  const goalsGrouped = {};
  let header = "";
  goals.forEach(g => {
    console.log("G",g)
    const assArray = g.week.split("/");
    assArray[1] = ", "+assArray[1].charAt(0).toUpperCase() + assArray[1].slice(1)
    const h = `${assArray.join("")}`;
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
    console.log("H",h)
    goalsGrouped[h].push({ day: title, sortField:g.sortField,goals: makeUlForGoalsV2(g.goals) });
  });
  
  for(let key in goalsGrouped ){
    goalsGrouped[key].sort((a,b)=> a.sortField > b.sortField ? 1 : -1)
  }

  console.log("Geouped",goalsGrouped)
  const accordionItems = [];
  let id = 0;
  for (let property in goalsGrouped) {
    id++;
    const rows = goalsGrouped[property].map((g, idx) => (
      <tr key={idx} style={{margin:0,padding:0}}>
        <td style={{width:120}}>{g.day}</td>
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

  
  // return (
  //   <Layout>
  //     <h2>Learning Goals (Period-1)</h2>
  //     <p>All learning goals, listed pr. period/week</p>
  //     <ul>
  //     {items}  
  //     </ul>
  //   </Layout>
  // );
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
          learningGoals
        }
        
      }
    }
  }
`;
