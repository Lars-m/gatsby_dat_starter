import React from "react"

function handleGoalsColors(lineIn) {
  let line = lineIn.trim();
  if (!line.startsWith("[#")) {
    line =
      "<span style='background-color:green'>&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;" +
      line;
  }
  const red = line.replace(
    "[#red#]",
    "<span style='background-color:red'>&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;"
  );
  const lineOut = red.replace(
    "[#yellow#]",
    "<span style='background-color:orange'>&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;"
  );
  return lineOut;
};

export default function makeUlForGoals(row){
  const goalsAsArray = row.goals.split("\n");
  const goals = goalsAsArray
    .filter(g => g.goals !== "")
    .map((g, idx) => (
      <li
        key={idx}
        dangerouslySetInnerHTML={{ __html: handleGoalsColors(g) }}
      />
    ));
    return <ul style={{margin:0, listStyleType: "none" }}>{goals}</ul>;
}