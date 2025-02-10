exports.addDaysToDate = (date,days)=>{
    let daysInSec = days*24*60*60*1000;
    let totalSecs = date.getTime()+daysInSec;
    return new Date(totalSecs);
}