function getDayInWeekFromDkDate(input) {
  if (input === null) {
    throw new Error("Provided date is null");
  }
  const dp = input.split("-");

  const dayInWeek = new Date(dp[2], dp[1] - 1, dp[0]).getDay();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thuersday",
    "Friday",
    "Saturday"
  ];
  return days[dayInWeek];
}
function getDateFromDkDate(date) {
  if(date === null){
    return date;
  }
  const dp = date.split("-");
  //Todo: Make a better check to see whether input is a date or not
  if (!(dp.length === 3)) {
    return date;
  }
  return new Date(dp[2], dp[1] - 1, dp[0]).getTime();
}


export { getDateFromDkDate, getDayInWeekFromDkDate };
