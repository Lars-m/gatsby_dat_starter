/*
Taken from the main project. 
Refactor into a npm-package to reuse between projects and avoid redundant code
*/
module.exports = function getDateFromDkDate(date) {

  function getNumbersFromString(str){
    let newString = "";
    for(let i = 0; i < str.length;i++){
      if(!isNaN(str[i])){
        newString += str[i]
      }
    }
    return Number(newString);
  }

  if(date === null){
    return date;
  }
  const dp = date.split("-");
  //Todo: Make a better check to see whether input is a date or not
  if (!(dp.length === 3)) {
    return date;
  }
  //This ensures you can sort on dates, even for strings like (SP2) (30-08-2019)
  const day = getNumbersFromString(dp[2]);
  const month = getNumbersFromString(dp[1]);
  const year = getNumbersFromString(dp[0]);
  try{
  const aDate = new Date(day,month,year).getTime();
  return aDate;
  } catch (ex){
    return null;
  }
  //return new Date(dp[2], dp[1] - 1, dp[0]).getTime();
}