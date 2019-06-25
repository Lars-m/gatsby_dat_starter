const crypto = require("crypto");
const fetch = require("node-fetch");

/*
Inspired by this tutorial:
https://www.wildsmithstudio.com/blog/using-remote-resources-with-gatsby/
*/

const API_URI =
  "https://spreadsheets.google.com/feeds/list/1gNWaa-7dJ9rU7jkcQoWbx1MNKOU3MwJMgzcdJ_J2wI8/od6/public/values?alt=json";

function isValidDKDate(dateStr) {
  try {
    if (dateStr === null) {
      return false;
    }
    const dp = dateStr.split("-");
    if (dp.length != 3) {
      return false;
    }
    const year = Number(dp[2]);
    const month = Number(dp[1] - 1);
    const day = Number(dp[0]);
    const date = new Date();
    date.setFullYear(year, month, day);
    if (!(date.getFullYear() === year)) {
      return false;
    }
    if (!(date.getMonth() === month)) {
      return false;
    }
  } catch (err) {
    return false;
  }
  return true;
}

function prettify(data) {
  for (var i = 0; i < data.feed.entry.length; i++) {
    for (var key in data.feed.entry[i]) {
      if (
        data.feed.entry[i].hasOwnProperty(key) &&
        key.substr(0, 4) === "gsx$"
      ) {
        // copy the value in the key up a level and delete the original key
        data.feed.entry[i][key.substr(4)] = data.feed.entry[i][key].$t;
        delete data.feed.entry[i][key];
      }
    }
  }
  return data.feed.entry;
}

exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions;

  const rows = await fetch(API_URI).then(r => r.json());
  const days = rows.feed.entry
    .filter(e => (e.gsx$day.$t !== null && isValidDKDate(e.gsx$day.$t)))
    .map(e => {
      const row = {};
      let dayInfo = {};

      //Properties looks like this: "gsx$a-teacher"
      for (prop in e) {
        if (prop.endsWith("-teacher")) {
          const classId = prop[prop.indexOf("$") + 1];
          if (!dayInfo[classId]) {
            dayInfo[classId] = {};
          }
          dayInfo[classId].teacher = e[prop].$t ? e[prop].$t : null;
        }
        if (prop.endsWith("-room")) {
          const classId = prop[prop.indexOf("$") + 1];
          if (!dayInfo[classId]) {
            dayInfo[classId] = {};
          }
          dayInfo[classId].room = e[prop].$t ? e[prop].$t : null;
        }
        if (prop.endsWith("-time")) {
          const classId = prop[prop.indexOf("$") + 1];
          if (!dayInfo[classId]) {
            dayInfo[classId] = {};
          }
          dayInfo[classId].time = e[prop].$t ? e[prop].$t : null;
        }
      }
      row.dayInfo = JSON.stringify(dayInfo);
      row.day = e.gsx$day.$t;
      row.week = e.gsx$week.$t;
      row.period = e.gsx$period.$t;
      return row;
    });
    
  days.forEach(async (row, idx) => {
    await createNode({
      children: [],
      id: "day-info" + idx,  //first part to avoid conflits with id's from other plugins
      day: row.day,
      week: row.week,
      period: row.period,
      dayInfo: row.dayInfo,
      parent: null,
      internal: {
        type: "DayInfo",
        contentDigest: crypto
          .createHash(`md5`)
          .update(JSON.stringify(row))
          .digest(`hex`)
      }
    });
  });
};
