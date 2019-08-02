import React from "react";

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
}

function addColorBoxes(goals) {
  let items = goals.filter(itm => itm).map(item => item.trim());

  items = items.map((item, i) => {
    if (!item.startsWith("[:")) {
      item = "[:g:]" + item;
    }

    let withBoxes = item.replace(
      /\[:g:\]/g,
      "<i class='	fa fa-square' style='font-size:16px;color:green'></i>&nbsp;"
    );
    withBoxes = withBoxes.replace(
      /\[:y:\]/g,
      "<i class='	fa fa-square' style='font-size:16px;color:orange'></i>&nbsp;"
    );
    withBoxes = withBoxes.replace(
      /\[:r:\]/,
      "<i class='	fa fa-square' style='font-size:16px;color:red'></i>&nbsp;"
    );
    return (
      <li key={i} dangerouslySetInnerHTML={{ __html: withBoxes}} />
    );
  });
  return items;
}

function makeUlForGoalsV2(goals) {
  
  const listItems = addColorBoxes(goals);
  
  return <ul style={{ margin: 0, listStyleType: "none" }}>{listItems}</ul>;
}

function makeUlForGoals(row) {
  const goalsAsArray = row.goals.split("\n");
  const goals = goalsAsArray
    .filter(g => g.goals !== "")
    .map((g, idx) => (
      <li
        key={idx}
        dangerouslySetInnerHTML={{ __html: handleGoalsColors(g) }}
      />
    ));
  return <ul style={{ margin: 0, listStyleType: "none" }}>{goals}</ul>;
}

export { makeUlForGoalsV2, makeUlForGoals };
