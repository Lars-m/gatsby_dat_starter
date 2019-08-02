//const visit = require('unist-util-visit');
const select = require("unist-util-select").select;
const getDateFromDkDate = require("./dateUtils");

/*
About manipulating the Abstract Syntax Three (AST)
To understand what goes one here use the AST Explorer https://astexplorer.net/
with this input:

<lg>
  :green:fafsaf
  :red:afhajkshfd
</lg>
*/

module.exports = ({markdownAST,markdownNode}) => {
  
  const goal = select("html",markdownAST)
  if(goal && goal.value.startsWith("<lg>")){

    if(markdownNode.fields.depth >2){
      //Overrides cannot declare learning goals, they must be shared by all classes
      goal.value="<!-- Learning goals removed from this override -->";
      return;
    }

    let str = goal.value;
    let items = str.split("\n");
    const rawLines = items.map(i=>{
      if(i==="<lg>" || i === "</lg>"){
        return null
      }
      return i;
    }).filter(i=>i);
    const listItems = rawLines.join("");
    //goal.value= "<h2>Learning Goals</h2>"+"<ul style='list-style:none'>"+listItems+"</ul>";
    goal.value="<!-- Learning goals harvested -->"
  
    let g = {week:"",day:""};
    try{
       g.week = markdownNode.fields.inFolder;
       g.day = markdownNode.fields.shortTitle;
       g.sortField = getDateFromDkDate(g.day)
         .toString()
         .toLowerCase();
    } catch(err){
      g.sortField = g.day;
    }
    g.goals = rawLines;
    //console.log("GOA",g)
    markdownNode.frontmatter.learningGoals = JSON.stringify(g);
  }
}