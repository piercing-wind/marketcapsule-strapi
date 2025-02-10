function daysBetween(date1, date2) {
    const date1_ms = new Date(date1).getTime();
    const date2_ms = new Date(date2).getTime();
  
    const difference_ms = Math.abs(date1_ms - date2_ms);
  
    const difference_days = Math.floor(difference_ms / (1000 * 60 * 60 * 24));
  
    return difference_days;
  }


  module.exports={daysBetween}
  

  