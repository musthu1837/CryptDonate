module.exports = function datediff(first, noOfDays) {
    var second = new Date().getTime();
    var days = Math.round((second-first*1000)/(1000*60*60*24));
    var diff = noOfDays - days;
    if( diff > 0){
      return "more "+diff+" day(s)";
    }
    else{
      return "about to close"
    }
}
