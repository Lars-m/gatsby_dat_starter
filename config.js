module.exports = {
  title1: `DAT 3. semester`,
  title2: `Fall 2019`,
  classes: [
    { value: 'a', label: 'A-class',backgroundColor:"#295683" },
    { value: 'b', label: 'B-class',backgroundColor:"black" },
    //{ value: 'c', label: 'Bornholm',backgroundColor: "#003300" }
    { value: 'c', label: 'Bornholm',backgroundColor: "#cc6600" }
  ],
  showWeekInfoForEachDayInWeek : false,
  timeEdit: "https://cloud.timeedit.net/cphbusiness/web/student",
  topMenu: [
    {
      title:"StudyPoints",
      URL: "https://studypoints.dk"
    },
    {
      title:"Schedule",
      route: "/full-schedule"
    },
    {
      title:"Goals",
      route: "/learning-goals"
    },
    {
      title:"Exercises",
      route: "/all-exercises"
    },
    {
      title:"Read",
      route: "/all-readings"
    },
    {
      title:"Links",
      route: "/links"
    },
    {
      title:"About",
      route: "/"
    },
  ]
}