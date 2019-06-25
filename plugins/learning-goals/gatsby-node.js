const crypto = require("crypto");
const fetch = require("node-fetch");

/*
Inspired by this tutorial:
https://www.wildsmithstudio.com/blog/using-remote-resources-with-gatsby/
*/

const API_URI =
  "https://spreadsheets.google.com/feeds/list/1gNWaa-7dJ9rU7jkcQoWbx1MNKOU3MwJMgzcdJ_J2wI8/od6/public/values?alt=json";

exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions;

  const rows = await fetch(API_URI).then(r => r.json());
  const goals = rows.feed.entry
    .filter(e => e.gsx$goals.$t !== (null || ""))
    .map(e => {
      // console.log("-Goal->", e.gsx$goals.$t);
      // console.log("--->", e.gsx$day.$t);
      const row = {};
      row.day = e.gsx$day.$t;
      row.dayLong = `${e.gsx$day.$t}`;
      row.week = e.gsx$week.$t;
      row.topic = e.gsx$topic.$t;
      row.period = e.gsx$period.$t;
      row.goals = e.gsx$goals.$t;
      return row;
    });
 
  goals.forEach(async (row,idx) => {
    await createNode({
      children: [],
      id: ""+idx,
      day: row.day,
      week: row.week,
      period: row.period,
      topic: row.topic,
      goals:  row.goals,
      parent: null,
      internal: {
        type: "LearningGoal",
        contentDigest: crypto
          .createHash(`md5`)
          .update(JSON.stringify(row))
          .digest(`hex`)
      }
    });
  })
};
