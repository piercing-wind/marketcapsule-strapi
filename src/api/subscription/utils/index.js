exports.AddDaysToTime=(date,days)=>{
    let dayInMilliseconds = parseInt(days)* 24 * 60 * 60 * 1000;
    let futureTimestamp=dayInMilliseconds+date.getTime();
    let  futureDate = new Date(futureTimestamp);
    return futureDate;
}